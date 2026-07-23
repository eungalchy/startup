const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();
const DB = require('./database.js');

const authCookieName = 'token';
const port = process.argv.length > 2 ? process.argv[2] : 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

const apiRouter = express.Router();
app.use(`/api`, apiRouter);

apiRouter.post('/auth/register', async (req, res) => {
  if (await DB.getUser(req.body.username)) {
    res.status(409).send({ msg: 'Username already taken' });
  } else {
    const user = await createUser(req.body.username, req.body.password);
    setAuthCookie(res, user.token);
    res.send({ username: user.username });
  }
});

apiRouter.post('/auth/login', async (req, res) => {
  const user = await DB.getUser(req.body.username);
  if (user && await bcrypt.compare(req.body.password, user.password)) {
    user.token = uuid.v4();
    await DB.updateUser(user);
    setAuthCookie(res, user.token);
    res.send({ username: user.username });
    return;
  }
  res.status(401).send({ msg: 'Invalid credentials' });
});

apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await DB.getUserByToken(req.cookies[authCookieName]);
  if (user) {
    await DB.updateUserRemoveAuth(user);
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

const verifyAuth = async (req, res, next) => {
  const user = await DB.getUserByToken(req.cookies[authCookieName]);
  if (user) {
    req.user = user;
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

apiRouter.get('/exchange-rate', async (req, res) => {
  try {
    const apiKey = process.env.EXCHANGE_RATE_API_KEY;
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
    if (!response.ok) throw new Error('API request failed');
    const data = await response.json();
    res.json({ rate: data.conversion_rates.KRW });
  } catch (err) {
    res.status(503).json({ rate: 1380 });
  }
});

apiRouter.get('/expenses', verifyAuth, async (req, res) => {
  const expenses = await DB.getExpenses(req.user.username);
  res.send(expenses);
});

apiRouter.post('/expenses', verifyAuth, async (req, res) => {
  const expense = { ...req.body, username: req.user.username };
  await DB.addExpense(expense);
  res.send(expense);
});

apiRouter.get('/user/me', verifyAuth, async (req, res) => {
  res.json({ username: req.user.username });
});

apiRouter.delete('/expenses/:id', verifyAuth, async (req, res) => {
  await DB.deleteExpense(req.params.id);
  res.status(204).end();
});

app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

async function createUser(username, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    username,
    password: passwordHash,
    token: uuid.v4(),
  };
  await DB.addUser(user);
  return user;
}

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
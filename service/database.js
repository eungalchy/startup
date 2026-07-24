const { MongoClient, ObjectId } = require('mongodb');
const url = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOSTNAME}`;
const client = new MongoClient(url);
const db = client.db('spender');
const userCollection = db.collection('users');
const expenseCollection = db.collection('expenses');
const groupExpenseCollection = db.collection('groupExpenses');
const cacheCollection = db.collection('cache');


(async function connectDB() {
  try {
    await client.connect();
    console.log('Connect to database');
  } catch (err) {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  }
})();

async function addUser(user) {
  await userCollection.insertOne(user);
}

async function getUser(username) {
  return userCollection.findOne({ username });
}

async function getUserByToken(token) {
  return userCollection.findOne({ token });
}

async function updateUser(user) {
  await userCollection.updateOne({ username: user.username }, { $set: user });
}

async function updateUserRemoveAuth(user) {
  await userCollection.updateOne({ username: user.username }, { $set: { token: '' } });
}

async function addExpense(expense) {
  await expenseCollection.insertOne(expense);
}

async function getExpenses(username) {
  return expenseCollection.find({ username }).toArray();
}

async function deleteExpense(id, username) {
  await expenseCollection.deleteOne({ _id: new ObjectId(id), username });
}

async function addGroupExpense(expense) {
  await groupExpenseCollection.insertOne(expense);
}

async function getGroupExpenses() {
  return groupExpenseCollection.find({}).toArray();
}

async function deleteGroupExpense(id) {
  await groupExpenseCollection.deleteOne({ _id: new ObjectId(id) });
}

async function saveExchangeRate(rate) {
  await cacheCollection.updateOne(
    { key: 'exchangeRate' },
    { $set: { key: 'exchangeRate', rate, updatedAt: new Date() } },
    { upsert: true }
  );
}

async function getLastExchangeRate() {
  const cached = await cacheCollection.findOne({ key: 'exchangeRate' });
  return cached ? cached.rate : 1380;
}

module.exports = {
  addUser,
  getUser,
  getUserByToken,
  updateUser,
  updateUserRemoveAuth,
  addExpense,
  getExpenses,
  deleteExpense,
  addGroupExpense,
  getGroupExpenses,
  deleteGroupExpense,
  saveExchangeRate,
  getLastExchangeRate
};
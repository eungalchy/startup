export function Dashboard() {
  const username = localStorage.getItem('username') || 'User';
  const [expenses, setExpenses] = useState([]);
  const [exchangeRate, setExchangeRate] = useState('loading...');
  const [newCategory, setNewCategory] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [socket, setSocket] = useState(null);
  const [recentUpdates, setRecentUpdates] = useState(
    JSON.parse(localStorage.getItem('recentUpdates') || '[]')
  );

  useEffect(() => {
    // Load expenses from server
    fetch('/api/expenses')
      .then(res => res.json())
      .then(data => setExpenses(data))
      .catch(() => setExpenses([]));


    fetch('/api/exchange-rate')
      .then(res => res.json())
      .then(data => setExchangeRate(data.rate.toLocaleString()));

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const newSocket = new WebSocket(`${protocol}//${window.location.host}/ws`);
    setSocket(newSocket);
    newSocket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'expense' && msg.username !== username) {
        setRecentUpdates(prev => {
          const updated = [`${msg.username} added ${msg.category}`, ...prev].slice(0, 5);
          localStorage.setItem('recentUpdates', JSON.stringify(updated));
          return updated;
        });
      }
    };
    return () => newSocket.close();

  }, []);

  async function addExpense(e) {
    e.preventDefault();
    if (newCategory && newAmount) {
      const today = new Date().toISOString().split('T')[0];
      const expense = { category: newCategory, amount: parseFloat(newAmount), date: today };
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense),
      });
      if (response.ok) {
        const saved = await response.json();
        setExpenses([...expenses, saved]);
        const newUpdate = `Added ${saved.category} - $${saved.amount} on ${saved.date}`;
        setRecentUpdates(prev => {
          const updated = [newUpdate, ...prev].slice(0, 5);
          localStorage.setItem('recentUpdates', JSON.stringify(updated));
          return updated;
        });
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: 'expense', username, category: newCategory }));
        }
        setNewCategory('');
        setNewAmount('');
      }
    }
  }

  async function deleteExpense(id) {
    await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
    await fetch(`/api/group-expenses/${id}`, { method: 'DELETE' });
    const deletedExpense = expenses.find(e => e._id === id);
    setExpenses(expenses.filter(e => e._id !== id));

    // // groupExpenses에서도 삭제
    // const groupExpenses = JSON.parse(localStorage.getItem('groupExpenses') || '[]');
    // const updatedGroup = groupExpenses.filter(e => e._id !== id);
    // localStorage.setItem('groupExpenses', JSON.stringify(updatedGroup));

    // recentUpdates에서도 삭제
    if (deletedExpense) {
      const updates = JSON.parse(localStorage.getItem('recentUpdates') || '[]');
      const updatedUpdates = updates.filter(u => !u.includes(deletedExpense.category));
      localStorage.setItem('recentUpdates', JSON.stringify(updatedUpdates));
    }

    // expenseMembers에서도 삭제
    const expenseMembers = JSON.parse(localStorage.getItem('expenseMembers') || '{}');
    delete expenseMembers[id];
    localStorage.setItem('expenseMembers', JSON.stringify(expenseMembers));
  }

  async function shareToGroup(expense) {
    const response = await fetch('/api/group-expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense),
    });
    if (response.ok) {
      alert(`${expense.category} shared to group!`);
    }
  }
  return (
    <main className="container">
      <img src="spender_logo.png" alt="Spender Logo" />
      <p>Welcome, <span>{username}</span>!</p>

      <div className="card">
        <h2>Your Expenses</h2>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense._id}>
                <td>{expense.category}</td>
                <td>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(expense.amount)}</td>
                <td>{expense.date}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => deleteExpense(expense._id)}>Delete</button>
                  <button className="btn btn-secondary ms-2" onClick={() => shareToGroup(expense)}>Share</button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
        <p><strong>Total: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(expenses.reduce((sum, expense) => sum + expense.amount, 0))}</strong></p>
      </div>

      <div className="card">
        <h3>Add Expense</h3>
        <form onSubmit={addExpense}>
          <input
            type="text"
            placeholder="Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">+ Add Expense</button>
        </form>
      </div>
      <div className="card">
        <h3>Exchange Rates</h3>
        <p>1 USD = <span>{exchangeRate}</span> KRW</p>
      </div>
      <div className="card">
        <h3>Recent Activity</h3>
        {recentUpdates.length === 0 ?
          <p>No recent activity.</p> :
          <ul>
            {recentUpdates.map((update, i) => (
              <li key={i}>{update}</li>
            ))}
          </ul>
        }
      </div>

    </main>
  );
}
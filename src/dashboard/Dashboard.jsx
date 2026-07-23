import { useState, useEffect } from 'react';

export function Dashboard() {
  const username = localStorage.getItem('username') || 'User';
  const [expenses, setExpenses] = useState([]);
  const [exchangeRate, setExchangeRate] = useState('loading...');
  const [liveUpdate, setLiveUpdate] = useState('Waiting for group activities...');
  const [newCategory, setNewCategory] = useState('');
  const [newAmount, setNewAmount] = useState('');

  useEffect(() => {
    // Load expenses from server
    fetch('/api/expenses')
      .then(res => res.json())
      .then(data => setExpenses(data))
      .catch(() => setExpenses([]));


    fetch('/api/exchange-rate')
      .then(res => res.json())
      .then(data => setExchangeRate(data.rate.toLocaleString()));

    // Mock WebSocket
    const interval = setInterval(() => {
      const users = ['Alice', 'Bob', 'Charlie'];
      const randomUser = users[Math.floor(Math.random() * users.length)];
      setLiveUpdate(`${randomUser} added a new expense!`);
    }, 5000);

    return () => clearInterval(interval);
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
        setNewCategory('');
        setNewAmount('');
      }
    }
  }

  async function deleteExpense(id) {
    await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
    setExpenses(expenses.filter(e => e._id !== id));
  }

  return (
    <main className="container">
      <h1>Dashboard</h1>
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
        <h3>Updates</h3>
        <p>{liveUpdate}</p>
      </div>
    </main>
  );
}
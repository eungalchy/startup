import { useState, useEffect } from 'react';

export function Dashboard() {
  const username = localStorage.getItem('username') || 'User';
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [
    { category: 'Food', amount: '$12.00', date: '2026-06-28' },
    { category: 'Transportation', amount: '$5.00', date: '2026-06-27' },
    ];
});
  const [exchangeRate, setExchangeRate] = useState('loading...');
  const [liveUpdate, setLiveUpdate] = useState('Waiting for group activities...');
  const [newCategory, setNewCategory] = useState('');
  const [newAmount, setNewAmount] = useState('');

  useEffect(() => {
    // Mock exchange rate - will be replaced with API call
    setExchangeRate('1,380');

    // Mock WebSocket - will be replaced with real WebSocket
    const interval = setInterval(() => {
      const users = ['Alice', 'Bob', 'Charlie'];
      const randomUser = users[Math.floor(Math.random() * users.length)];
      setLiveUpdate(`${randomUser} added a new expense!`);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  function addExpense(e) {
    e.preventDefault();
    if (newCategory && newAmount) {
      const today = new Date().toISOString().split('T')[0];
      const newExpense = [...expenses, { category: newCategory, amount: `$${newAmount}`, date: today }];
      setExpenses(newExpense);
      localStorage.setItem('expenses', JSON.stringify(newExpense));
      setNewCategory('');
      setNewAmount('');
    }
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
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, index) => (
              <tr key={index}>
                <td>{expense.category}</td>
                <td>{expense.amount}</td>
                <td>{expense.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p><strong>Total: ${expenses.reduce((sum, expense) => sum + parseFloat(expense.amount.slice(1)), 0).toFixed(2)}</strong></p>
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
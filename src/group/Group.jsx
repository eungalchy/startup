import { useState, useEffect } from 'react';

export function Group() {
  const [members] = useState(['Alice', 'Bob', 'Charlie']);
  const [expenses, setExpenses] = useState([
    { member: 'Alice', amount: 20 },
    { member: 'Bob', amount: 15 },
    { member: 'Charlie', amount: 10 },
  ]);
  const [liveUpdate, setLiveUpdate] = useState('Waiting for group activities...');
  const [splitResult, setSplitResult] = useState('');

  useEffect(() => {
    // Mock WebSocket - will be replaced with real WebSocket
    const interval = setInterval(() => {
      const randomMember = members[Math.floor(Math.random() * members.length)];
      setLiveUpdate(`${randomMember} added a new expense!`);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  function splitBill() {
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const perPerson = (total / members.length).toFixed(2);
    setSplitResult(`Total: $${total} | Each person owes: $${perPerson}`);
  }

  return (
    <main className="container">
      <h1>Group Expenses</h1>

      <div className="card">
        <h2>Group Members</h2>
        <ul>
          {expenses.map((e, index) => (
            <li key={index}>{e.member} - ${e.amount}</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2>Updates</h2>
        <p>{liveUpdate}</p>
      </div>

      <button className="btn btn-primary" onClick={splitBill}>+ Split Bill</button>
      {splitResult && <p className="mt-3">{splitResult}</p>}
    </main>
  );
}
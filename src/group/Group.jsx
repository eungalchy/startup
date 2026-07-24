import { useState, useEffect } from 'react';

export function Group() {
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState('');
  const [groupExpenses, setGroupExpenses] = useState([]);
  const [liveUpdate, setLiveUpdate] = useState([]);
  const [splitResult, setSplitResult] = useState([]);

  useEffect(() => {
    // Mock WebSocket - will be replaced with real WebSocket
    const savedMembers = JSON.parse(localStorage.getItem('groupMembers') || '[]');
    setMembers(savedMembers);
    const savedExpenses = JSON.parse(localStorage.getItem('groupExpenses') || '[]');
    setGroupExpenses(savedExpenses);
    const savedUpdates = JSON.parse(localStorage.getItem('recentUpdates') || '[]');
    setLiveUpdate(savedUpdates);
  }, []);


  function addMember(e) {
    e.preventDefault();
    if (newMember) {
      const updated = [...members, newMember];
      setMembers(updated);
      localStorage.setItem('groupMembers', JSON.stringify(updated));
      setNewMember('');
    }
  }

  function splitBill() {
    if (members.length === 0) return;
    const total = groupExpenses.reduce((sum, e) => sum + e.amount, 0);
    const perPerson = total / members.length;

    const results = members.map(member => {
      const paid = groupExpenses
        .filter(e => e.sharedBy === member)
        .reduce((sum, e) => sum + e.amount, 0);
      const balance = paid - perPerson;
      return { member, balance: balance.toFixed(2) };
    });

    setSplitResult(results);
  }

  return (
    <main className="container">
      <h1>Group Expenses</h1>

      <div className="card">
        <h2>Add Member</h2>
        <form onSubmit={addMember}>
          <input
            type="text"
            placeholder="Member name"
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Add Member</button>
        </form>
        <ul className="mt-3">
          {members.map((m, i) => <li key={i}>{m}</li>)}
        </ul>
      </div>

      <div className="card">
        <h2>Group Expenses</h2>
        {groupExpenses.length === 0 ? <p>No expenses shared yet.</p> :
          <ul>
            {groupExpenses.map((e, i) => (
              <li key={i}>{e.category} - ${e.amount} (shared by {e.sharedBy})</li>
            ))}
          </ul>
        }
      </div>

      <div className="card">
        <h2>Recent Activity</h2>
        {liveUpdate.length === 0 ? <p>No recent activity.</p> :
          <ul>
            {liveUpdate.map((update, i) => (
              <li key={i}>{update}</li>
            ))}
          </ul>
        }
      </div>

      <button className="btn btn-primary" onClick={splitBill}>Split Bill</button>

      {splitResult.length > 0 && (
        <div className="card mt-3">
          <h2>Balance</h2>
          {splitResult.map((r, i) => (
            <p key={i}>
              {r.member}: {r.balance > 0 ? `+$${r.balance} (owed to them)` : r.balance < 0 ? `-$${Math.abs(r.balance)} (owes)` : 'settled'}
            </p>
          ))}
        </div>
      )}
    </main>
  );
}
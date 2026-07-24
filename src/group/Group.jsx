import { useState, useEffect } from 'react';

export function Group() {
  const [groupExpenses, setGroupExpenses] = useState([]);
  const [liveUpdate, setLiveUpdate] = useState([]);
  const [memberInputs, setMemberInputs] = useState({});
  const [expenseMembers, setExpenseMembers] = useState({});
  const [splitResults, setSplitResults] = useState({});

  useEffect(() => {
    const savedExpenses = JSON.parse(localStorage.getItem('groupExpenses') || '[]');
    setGroupExpenses(savedExpenses);
    const savedUpdates = JSON.parse(localStorage.getItem('recentUpdates') || '[]');
    setLiveUpdate(savedUpdates);
    const savedMembers = JSON.parse(localStorage.getItem('expenseMembers') || '{}');
    setExpenseMembers(savedMembers);
  }, []);

  function addMember(expenseId) {
    const name = memberInputs[expenseId];
    if (!name) return;
    const current = expenseMembers[expenseId] || [];
    const updated = { ...expenseMembers, [expenseId]: [...current, name] };
    setExpenseMembers(updated);
    localStorage.setItem('expenseMembers', JSON.stringify(updated));
    setMemberInputs({ ...memberInputs, [expenseId]: '' });
  }

  function splitBill(expense) {
    const members = expenseMembers[expense._id] || [];
    if (members.length === 0) {
      setSplitResults({ ...splitResults, [expense._id]: [''] });
    }
    const perPerson = (expense.amount / members.length).toFixed(2);
    const results = members.map(m => `${m}: $${perPerson}`);
    setSplitResults({ ...splitResults, [expense._id]: results });
  }

  function deleteGroupExpense(id) {
    const updated = groupExpenses.filter(e => e._id !== id);
    setGroupExpenses(updated);
    localStorage.setItem('groupExpenses', JSON.stringify(updated));

    const expMembers = { ...expenseMembers };
    delete expMembers[id];
    setExpenseMembers(expMembers);
    localStorage.setItem('expenseMembers', JSON.stringify(expMembers));
  }

  return (
    <main className="container">

      <div className="card">
        <h2>Group Expenses</h2>
        {groupExpenses.length === 0 ? <p>No expenses shared yet. Share from Dashboard!</p> :
          groupExpenses.map((e) => (
            <div key={e._id} className="card mt-2" style={{ position: 'relative' }}>
              <p><strong>{e.category}</strong> - {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(e.amount)} on {e.date} (by {e.sharedBy})</p>

              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Add member"
                  value={memberInputs[e._id] || ''}
                  onChange={(ev) => setMemberInputs({ ...memberInputs, [e._id]: ev.target.value })}
                />
                <button className="btn btn-secondary ms-2" onClick={() => addMember(e._id)}>Add Member</button>
              </div>

              {expenseMembers[e._id] && expenseMembers[e._id].length > 0 && (
                <ul className="mt-2">
                  {expenseMembers[e._id].map((m, i) => <li key={i}>{m}
                    <button className="btn btn-danger ms-2" style={{ padding: '0 0.3rem', fontSize: '0.7rem', lineHeight: '1.2' }} onClick={() => {
                      const updated = { ...expenseMembers, [e._id]: expenseMembers[e._id].filter((_, idx) => idx !== i) };
                      setExpenseMembers(updated);
                      localStorage.setItem('expenseMembers', JSON.stringify(updated));
                      if (updated[e._id].length === 0) {
                        const newSplit = { ...splitResults };
                        delete newSplit[e._id];
                        setSplitResults(newSplit);
                      }
                    }}>x</button>
                  </li>)}
                </ul>
              )}

              <button className="btn btn-primary mt-2" onClick={() => splitBill(e)}>Split Bill</button>
              <button className="btn btn-danger" style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', padding: '0.1rem 0.4rem', fontSize: '0.75rem', lineHeight: '1' }} onClick={() => deleteGroupExpense(e._id)}>x</button>

              {splitResults[e._id] && (
                <div className="mt-2">
                  {splitResults[e._id].map((r, i) => <p key={i}>{r}</p>)}
                </div>
              )}
            </div>
          ))
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
    </main>
  );
}
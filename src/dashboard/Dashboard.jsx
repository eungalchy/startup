export function Dashboard() {
    return (
        <main className="container">
            <h1>Dashboard</h1>
            <img src="spender_logo.png" alt="Spender Logo" />
            <p>Welcome, <span id="username">User</span>!</p>

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
                        <tr>
                            <td>Food</td>
                            <td>$12.00</td>
                            <td>2026-06-28</td>
                        </tr>
                        <tr>
                            <td>Transportation</td>
                            <td>$5.00</td>
                            <td>2026-06-27</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="card">
                <h3>Exchange Rates</h3>
                <p>1 USD = <span id="exchange-rate">loading...</span> KRW</p>
            </div>

            <div className="card">
                <h3>updates</h3>
                <p id="updates">Waiting for the group activities...</p>
            </div>

            <button className="btn btn-primary">+ Add Expense</button>
        </main>
    );
}
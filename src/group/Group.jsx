export function Group() {
    return (
        <main className="container">
            <h1>Group Expenses</h1>

            <div className="card">
                <h2>Group Members</h2>
                <ul>
                    <li>Member 1</li>
                    <li>Member 2</li>
                    <li>Member 3</li>
                </ul>
            </div>

            <div className="card">
                <h2>Updates</h2>
                <p id="updates">Waiting for the group activities...</p>
            </div>

            <button className="btn btn-primary">+ Split Bill</button>
        </main>
    );
}

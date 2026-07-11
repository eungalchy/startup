export function Login() {
    return (
        <main className="container">
            <h1>Login</h1>
            <form>
                <input type="text" placeholder="Username" />
                <input type="password" placeholder="Password" />
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
            <p>New user? <a href="/register">Register here</a></p>
        </main>
    );
}
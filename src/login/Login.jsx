import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            if (response.ok) {
                localStorage.setItem('username', username);
                onLogin();
                navigate('/dashboard');
            } else {
                setError('Invalid username or password');
            }
        } catch {
            setError('Unable to connect to server');
        }
    }

    return (
        <main className="container">
            <h1>Login</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">
                    Login
                </button>
            </form>
            <p>New user? <a href="/register">Register here</a></p>
        </main>
    );
}
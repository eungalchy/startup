import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Register({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleRegister(e) {
        e.preventDefault();
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            if (response.ok) {
                localStorage.setItem('username', username);
                onLogin();
                navigate('/dashboard');
            } else {
                const data = await response.json();
                setError(data.msg || 'Registration failed');
            }
        } catch {
            setError('Unable to connect to server');
        }
    }

    return (
        <main className="container">
            <h1>Register</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleRegister}>
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
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
            <p>Already have an account? <a href="/">Login</a></p>
        </main>
    );
}
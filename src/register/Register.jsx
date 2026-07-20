import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    function handleRegister(e) {
        e.preventDefault();
        localStorage.setItem('username', username);
        navigate('/dashboard');
    }

    return (
        <main className="container">
            <h1>Register</h1>
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
            <p>Already have an account? <a href="/login">Login</a></p>
        </main>
    );
}
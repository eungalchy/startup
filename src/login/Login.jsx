import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

export function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    function handleLogin(e) {
        e.preventDefault();
        localStorage.setItem('username', username);
        navigate('/dashboard');
    }

    return (
        <main className="container">
            <h1>Login</h1>
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
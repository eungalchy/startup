import { BrowserRouter, Route, Routes, NavLink, Navigate } from "react-router-dom";
import { Login } from "./login/Login";
import { Dashboard } from "./dashboard/Dashboard";
import { Group } from "./group/Group";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Register } from "./register/Register";
import { useState } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('username'));

  function handleLogout() {
    localStorage.removeItem('username');
    setIsLoggedIn(false);
  }
  return (
    <BrowserRouter>
      <header>
        <h1>Spender</h1>
        <nav>
          {isLoggedIn ? (
            <>
              <a onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</a>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/group">Group</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
        <Route path="/register" element={<Register onLogin={() => setIsLoggedIn(true)} />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/group" element={isLoggedIn ? <Group /> : <Navigate to="/" />} />

      </Routes>

      <footer>
        <p>Made by Jinho Lee</p>
        <p>web programming 260</p>
        <a href="https://github.com/eungalchy/startup">GitHub</a>
      </footer>
    </BrowserRouter>
  );
}
export default App;
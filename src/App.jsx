import { BrowserRouter, Route, Routes, NavLink } from "react-router-dom";
import { Login } from "./login/Login";
import { Dashboard } from "./dashboard/Dashboard";
import { Group } from "./group/Group";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Register } from "./register/Register";

function App() {
    return (
        <BrowserRouter>
            <header>
              <h1>Spender</h1>
              <nav>
                <NavLink to="/">Login</NavLink>
                <NavLink to="/register">Register</NavLink>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/group">Group</NavLink>
              </nav>
            </header>

            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/group" element={<Group />} />
            </Routes>

            <footer>
              <p>Made by Jinho Lee</p>
              <a href="https://github.com/eungalchy/startup">GitHub</a>
            </footer>
          </BrowserRouter>
        );
      }
export default App;
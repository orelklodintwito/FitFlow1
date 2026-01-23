// src/components/Header.jsx
import { NavLink } from "react-router-dom";
import "../styles/header.css";

function Header({ setIsLoggedIn }) {
  return (
    <header className="header">
      <div className="logo">FitFlow</div>

      <nav className="nav">
        <NavLink
          to="/"
          className={({ isActive }) => `nav-pill ${isActive ? "active" : ""}`}
        >
          Home
        </NavLink>

        <NavLink
          to="/form"
          className={({ isActive }) => `nav-pill ${isActive ? "active" : ""}`}
        >
          Meals
        </NavLink>

        <NavLink
          to="/api"
          className={({ isActive }) => `nav-pill ${isActive ? "active" : ""}`}
        >
          Recipes
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) => `nav-pill ${isActive ? "active" : ""}`}
        >
          Profile
        </NavLink>

        <NavLink
          to="/challenge"
          className={({ isActive }) => `nav-pill ${isActive ? "active" : ""}`}
        >
          Challenge
        </NavLink>
      </nav>

      <button
        className="logout-pill"
        onClick={() => {
          localStorage.removeItem("isLoggedIn");
          setIsLoggedIn(false);
        }}
      >
        Logout
      </button>
    </header>
  );
}

export default Header;

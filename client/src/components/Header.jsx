import { NavLink } from "react-router-dom";
import "../styles/header.css";

function Header({ setIsLoggedIn }) {
  return (
    <header className="header">
      {/* Logo = Home */}
      <NavLink to="/" className="logo">
        FitFlow
      </NavLink>

      <nav className="nav">
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

        {/* ✅ PROFILE – תוקן מ־/settings ל־/profile */}
        <NavLink
          to="/profile"
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

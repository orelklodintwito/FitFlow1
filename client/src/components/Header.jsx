import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleMode } from "../redux/themeSlice";
import "../styles/header.css";

function Header({ setIsLoggedIn }) {
  const mode = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();

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

      {/* 🌙 / ☀️ Theme Toggle */}
      <button
        className="theme-toggle"
        onClick={() => dispatch(toggleMode())}
        aria-label="Toggle theme"
        title={
          mode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
        }
      >
        {mode === "dark" ? "☀️" : "🌙"}
      </button>
    </header>
  );
}

export default Header;

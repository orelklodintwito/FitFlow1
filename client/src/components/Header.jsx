// src/components/Header.jsx
import { NavLink } from "react-router-dom";
import "../styles/header.css";
import { useDispatch, useSelector } from "react-redux";
import { toggleMode } from "../redux/themeSlice";


function Header({ setIsLoggedIn }) {
  return (
    <header className="header">
      <div className="logo">FitFlow</div>

      <nav className="nav">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `nav-pill ${isActive ? "active" : ""}`
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/form"
          className={({ isActive }) =>
            `nav-pill ${isActive ? "active" : ""}`
          }
        >
          Meals
        </NavLink>

        <NavLink
          to="/api"
          className={({ isActive }) =>
            `nav-pill ${isActive ? "active" : ""}`
          }
        >
          Recipes
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `nav-pill ${isActive ? "active" : ""}`
          }
        >
          Profile
        </NavLink>

        <button
          className="logout-pill"
          onClick={() => {
            localStorage.removeItem("isLoggedIn");
            setIsLoggedIn(false);
          }}
        >
          Logout
        </button>
      </nav>
    </header>
  );
}

export default Header; 
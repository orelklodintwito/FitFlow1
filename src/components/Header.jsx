// src/components/Header.jsx
import React from "react";
import "../styles/header.css";

function Header({ page, setPage, setIsLoggedIn }) {
  return (
    <header className="header">

      <div className="logo">FitFlow</div>

      <nav className="nav">
        <button
          className={`nav-pill ${page === "home" ? "active" : ""}`}
          onClick={() => setPage("home")}
        >
          Home
        </button>

        <button
          className={`nav-pill ${page === "meals" ? "active" : ""}`}
          onClick={() => setPage("meals")}
        >
          Meals
        </button>

        <button
          className={`nav-pill ${page === "recipes" ? "active" : ""}`}
          onClick={() => setPage("recipes")}
        >
          Recipes
        </button>

        <button
          className={`nav-pill ${page === "settings" ? "active" : ""}`}
          onClick={() => setPage("settings")}
        >
          Profile
        </button>

        <button className="logout-pill" onClick={() => setIsLoggedIn(false)}>
          Logout
        </button>
      </nav>
    </header>
  );
}

export default Header;

// src/pages/Login.jsx
import { useState } from "react";
import bgImage from "../assets/images/login_bg.png";
import { login } from "../services/auth";

function Login({ setShowSignup, setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.includes("@")) {
      return setError("Please enter a valid email.");
    }

    if (password.length < 4) {
      return setError("Password must be at least 4 characters.");
    }

    try {
      // 🔗 קריאה לשרת
      const data = await login(email, password);

      // 🔐 שמירת token (נכון!)
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // סימון מחובר
      setIsLoggedIn(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="auth-bg" style={{ "--bg-image": `url(${bgImage})` }}>
      <div className="auth-box">
        <h1>Login to FitFlow</h1>

        <form className="auth-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="error-text">{error}</p>}

          <button type="submit">Login</button>
        </form>

        <p>
          Don't have an account?{" "}
          <span className="auth-link" onClick={() => setShowSignup(true)}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;

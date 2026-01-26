import { useState } from "react";
import bgImage from "../assets/images/login_bg.png";
import { login } from "../services/auth";
import { useNavigate } from "react-router-dom";

function Login({ setShowSignup, setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    const errors = {};

    if (!email) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 4) {
      errors.password = "Password must be at least 4 characters";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    try {
      setLoading(true);

      const data = await login(email, password);

      if (!data?.token) {
        throw new Error("Token not received from server");
      }

      localStorage.setItem("token", data.token);
      setIsLoggedIn(true);
      navigate("/challenge");
    } catch (err) {
      setServerError(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg" style={{ "--bg-image": `url(${bgImage})` }}>
      <div className="auth-box">
        <h1>Login to FitFlow</h1>

        <form className="auth-form" onSubmit={handleLogin} noValidate>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFieldErrors((prev) => ({ ...prev, email: "" }));
              setServerError("");
            }}
          />
          {fieldErrors.email && (
            <p className="error-text">{fieldErrors.email}</p>
          )}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setFieldErrors((prev) => ({ ...prev, password: "" }));
              setServerError("");
            }}
          />
          {fieldErrors.password && (
            <p className="error-text">{fieldErrors.password}</p>
          )}

          {serverError && <p className="error-text">{serverError}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
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

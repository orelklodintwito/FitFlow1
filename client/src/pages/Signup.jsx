// src/pages/Signup.jsx
import { useState } from "react";
import bgImage from "../assets/images/login_bg.png";

function Signup({ setShowSignup, setIsLoggedIn }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const [error, setError] = useState("");

  const bmi = weight && height ? weight / (height * height) : null;

  const handleSignup = (e) => {
    e.preventDefault();

    if (name.length < 3) return setError("Name must be at least 3 characters.");
    if (!email.includes("@")) return setError("Enter a valid email.");
    if (password.length < 4)
      return setError("Password must be at least 4 characters.");

    if (!age || age < 5 || age > 120)
      return setError("Please enter a valid age.");

    if (!weight || !height)
      return setError("Please enter weight & height.");

    console.log({
      name,
      email,
      password,
      age,
      weight,
      height,
      bmi: bmi?.toFixed(1),
    });

    setIsLoggedIn(true);
  };

  return (
    <div className="auth-bg" style={{ "--bg-image": `url(${bgImage})` }}>
      <div className="auth-box">

        <h1>Create Your Account</h1>

        <form className="auth-form" onSubmit={handleSignup}>
          
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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

          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />

          <input
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />

          <input
            type="number"
            placeholder="Height (m)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />

          {bmi && (
            <p className="bmi-preview">BMI: {bmi.toFixed(1)}</p>
          )}

          {error && <p className="error-text">{error}</p>}

          <button type="submit">Create Account</button>
        </form>

        <p>
          Already have an account?{" "}
          <span className="auth-link" onClick={() => setShowSignup(false)}>
            Log In
          </span>
        </p>

      </div>
    </div>
  );
}

export default Signup;

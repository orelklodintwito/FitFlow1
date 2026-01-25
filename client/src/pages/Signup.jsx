// src/pages/Signup.jsx
import { useState } from "react";
import bgImage from "../assets/images/login_bg.png";
import { signup } from "../services/auth"; // ✅ חובה

function Signup({ setShowSignup, setIsLoggedIn }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState(""); // cm

  const [error, setError] = useState("");

  const bmi =
    weight && height
      ? weight / Math.pow(height / 100, 2)
      : null;

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (name.length < 3) return setError("Name must be at least 3 characters.");
    if (!email.includes("@")) return setError("Enter a valid email.");
    if (password.length < 4)
      return setError("Password must be at least 4 characters.");
    if (!age || age < 5 || age > 120)
      return setError("Please enter a valid age.");
    if (!weight || !height)
      return setError("Please enter weight & height.");

    try {
      // 🔗 קריאה לשרת (כמו Login)
      const data = await signup({
        name,
        email,
        password,
        age: Number(age),
        weight: Number(weight),
        height: Number(height),
      });

      // 🔐 שמירת token
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // 💾 שמירת נתוני גוף (ל־Profile / BMI)
      localStorage.setItem(
        "userMetrics",
        JSON.stringify({
          height: Number(height),
          weight: Number(weight),
        })
      );

      // (אופציונלי) פרטי משתמש בסיסיים
      localStorage.setItem(
        "userProfile",
        JSON.stringify({
          name,
          email,
          age: Number(age),
        })
      );

      setIsLoggedIn(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Signup failed. Please try again."
      );
    }
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
            placeholder="Height (cm)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />

          {bmi && <p className="bmi-preview">BMI: {bmi.toFixed(1)}</p>}
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

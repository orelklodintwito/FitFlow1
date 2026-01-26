import { useState } from "react";
import bgImage from "../assets/images/login_bg.png";
import { signup } from "../services/auth";

function Signup({ setShowSignup, setIsLoggedIn }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const bmi =
    weight && height ? weight / Math.pow(height / 100, 2) : null;

  const validate = () => {
    const errors = {};

    if (!name || name.length < 3) {
      errors.name = "Name must be at least 3 characters";
    }

    if (!email) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!password || password.length < 4) {
      errors.password = "Password must be at least 4 characters";
    }

    if (!age || age < 5 || age > 120) {
      errors.age = "Please enter a valid age";
    }

    if (!weight) {
      errors.weight = "Weight is required";
    }

    if (!height) {
      errors.height = "Height is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    try {
      setLoading(true);

      const data = await signup({
        name,
        email,
        password,
        age: Number(age),
        weight: Number(weight),
        height: Number(height),
      });

      if (data?.token) {
        localStorage.setItem("token", data.token);
      }

      localStorage.setItem(
  "userProfile",
  JSON.stringify({
    id: data.userId,
    name,
    email,
    age: Number(age),
  })
);
localStorage.setItem(
  `userMetrics_${data.userId}`,
  JSON.stringify({
    height: Number(height),
    weight: Number(weight),
  })
);


      setIsLoggedIn(true);
    } catch (err) {
      setServerError(
        err.response?.data?.message ||
          "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const clearFieldError = (field) => {
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    setServerError("");
  };

  return (
    <div className="auth-bg" style={{ "--bg-image": `url(${bgImage})` }}>
      <div className="auth-box">
        <h1>Create Your Account</h1>

        <form className="auth-form" onSubmit={handleSignup} noValidate>
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              clearFieldError("name");
            }}
          />
          {fieldErrors.name && (
            <p className="error-text">{fieldErrors.name}</p>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearFieldError("email");
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
              clearFieldError("password");
            }}
          />
          {fieldErrors.password && (
            <p className="error-text">{fieldErrors.password}</p>
          )}

          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => {
              setAge(e.target.value);
              clearFieldError("age");
            }}
          />
          {fieldErrors.age && (
            <p className="error-text">{fieldErrors.age}</p>
          )}

          <input
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => {
              setWeight(e.target.value);
              clearFieldError("weight");
            }}
          />
          {fieldErrors.weight && (
            <p className="error-text">{fieldErrors.weight}</p>
          )}

          <input
            type="number"
            placeholder="Height (cm)"
            value={height}
            onChange={(e) => {
              setHeight(e.target.value);
              clearFieldError("height");
            }}
          />
          {fieldErrors.height && (
            <p className="error-text">{fieldErrors.height}</p>
          )}

          {bmi && <p className="bmi-preview">BMI: {bmi.toFixed(1)}</p>}
          {serverError && <p className="error-text">{serverError}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
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

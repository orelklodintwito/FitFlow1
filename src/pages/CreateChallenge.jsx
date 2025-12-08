// src/pages/CreateChallenge.jsx
import { useState } from "react";

function CreateChallenge() {
  const [name, setName] = useState("");
  const [days, setDays] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const err = {};
    if (name.length < 3) err.name = "Name must be at least 3 characters.";
    if (!days || days <= 0) err.days = "Days must be a positive number.";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    console.log({ name, days, difficulty });
    alert("Challenge logged to console!");
  };

  return (
    <div>
      <h1>Create Your Challenge</h1>

      <form onSubmit={onSubmit}>
        <label>
          Challenge Name
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}

        <label>
          Days
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
          />
        </label>
        {errors.days && <p style={{ color: "red" }}>{errors.days}</p>}

        <label>
          Difficulty
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>

        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default CreateChallenge;

// src/pages/HomePage.jsx
import { useState, useEffect } from "react";
import "../styles/homepage.css";
import "../styles/components.css";

import { useFavorites } from "../context/FavoritesContext.jsx";
import { getChallenge } from "../services/challenge";

// ⭐ REDUX
import { useSelector, useDispatch } from "react-redux";
import { toggleMode } from "../redux/themeSlice";

function HomePage({ meals, openFoodSearch, openManualFood }) {
  /* ============================== */
  /* REDUX */
  /* ============================== */
  const mode = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();

  /* ============================== */
  /* MEALS CALCULATIONS (FROM SERVER) */
  /* ============================== */
  const allMeals = Object.values(meals || {}).flat();

  const totalCalories = allMeals.reduce(
    (sum, meal) => sum + Number(meal.calories || 0),
    0
  );

  const totalProtein = allMeals.reduce(
    (sum, meal) => sum + Number(meal.protein || 0),
    0
  );

  const dailyGoal = 2000;
  const caloriesLeft = Math.max(dailyGoal - totalCalories, 0);
  const progressPercent = Math.min(
    100,
    Math.round((totalCalories / dailyGoal) * 100)
  );

  /* ============================== */
  /* CHALLENGE – FROM SERVER */
  /* ============================== */
  const [challenge, setChallenge] = useState(null);

  useEffect(() => {
    getChallenge()
      .then((res) => setChallenge(res.data))
      .catch(() => setChallenge(null));
  }, []);

  const hasChallenge = challenge && challenge.goals;
  const isWeekly = hasChallenge && challenge.trackingMode === "weekly";

  const challengeTitle = !hasChallenge
    ? "No Active Challenge"
    : isWeekly
    ? "Weekly Challenge"
    : "Daily Challenge";

  /* ============================== */
  /* FAVORITES */
  /* ============================== */
  const { favorites, removeFavorite } = useFavorites();

  /* ============================== */
  /* BMI – FROM USER METRICS */
  /* ============================== */
  const [height, setHeight] = useState(null);
  const [weight, setWeight] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("userMetrics"));
    if (saved) {
      setHeight(saved.height);
      setWeight(saved.weight);
    }
  }, []);

  const bmi =
    height && weight
      ? (weight / Math.pow(height / 100, 2)).toFixed(1)
      : null;

  const bmiMin = 15;
  const bmiMax = 35;

  const bmiPercent = bmi
    ? Math.min(
        100,
        Math.max(0, ((bmi - bmiMin) / (bmiMax - bmiMin)) * 100)
      )
    : 0;

  /* ============================== */
  /* MEAL MODAL */
  /* ============================== */
  const [chosenMeal, setChosenMeal] = useState(null);

  const handleManualAdd = () => {
    openManualFood(chosenMeal);
    setChosenMeal(null);
  };

  const handleApiAdd = () => {
    openFoodSearch(chosenMeal);
    setChosenMeal(null);
  };

  return (
    <div className={`home-full-bg ${mode}`}>
      <div className="dashboard">
        {/* ================= THEME ================= */}
        <div className="dashboard-card">
          <h2>Theme</h2>
          <button
            onClick={() => dispatch(toggleMode())}
            className="btn-green"
          >
            Switch to {mode === "dark" ? "Light" : "Dark"} Mode
          </button>
        </div>

        {/* ================= CHALLENGE ================= */}
        <div className="dashboard-card">
          <h2>{challengeTitle}</h2>

          {!challenge ? (
            <p className="small-text">No active challenge</p>
          ) : (
            <>
              <p className="small-text">
                🏃 Steps goal: {challenge.goals?.steps ?? "-"}
              </p>
              <p className="small-text">
                💧 Water goal: {challenge.goals?.water ?? "-"} L
              </p>
              <p className="small-text">
                🏋️ Workouts goal: {challenge.goals?.workouts ?? "-"}
              </p>

              <p className="motivation-text">
                {isWeekly
                  ? "Stay consistent all week 💪"
                  : "One step at a time today 🚀"}
              </p>
            </>
          )}
        </div>

        {/* ================= DAILY CALORIES ================= */}
        <div className="dashboard-card calories-card">
          <h2>Daily Calories</h2>

          <div className="calories-header">
            <div className="cal-left">
              <p className="big-number">{caloriesLeft} Left</p>
              <p className="left-number">
                Consumed: {totalCalories} kcal
              </p>
              <p className="small-text">
                Protein: {totalProtein} g
              </p>
            </div>

            <div className="cal-right">
              <div className="cal-progress">
                <div
                  className="cal-fill"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="meal-row">
            <button
              className="btn-green"
              onClick={() => setChosenMeal("breakfast")}
            >
              Breakfast
            </button>
            <button
              className="btn-green"
              onClick={() => setChosenMeal("lunch")}
            >
              Lunch
            </button>
            <button
              className="btn-green"
              onClick={() => setChosenMeal("dinner")}
            >
              Dinner
            </button>
          </div>
        </div>

        {/* ================= SUMMARY + BMI ================= */}
        <div className="summary-bmi-row">
          <div className="dashboard-card summary-card">
            <h2>Today's Summary</h2>
            <p>🍽 Meals logged: {allMeals.length}</p>
            <p>🔥 Calories consumed: {totalCalories}</p>
            <p>🥩 Protein: {totalProtein} g</p>
          </div>

          <div className="dashboard-card bmi-card">
            <h2>BMI</h2>

            <div className="bmi-progress-bar">
              <div className="bmi-zones">
                <span>Low</span>
                <span>Normal</span>
                <span>High</span>
              </div>

              <div className="bmi-line">
                <div
                  className="bmi-marker"
                  style={{ left: `${bmiPercent}%` }}
                ></div>
              </div>

              <p className="bmi-value">
                {bmi ? bmi : "Not calculated"}
              </p>
            </div>
          </div>
        </div>

        {/* ================= FAVORITES ================= */}
        <div className="dashboard-card">
          <h2>My Favorites</h2>

          {favorites.length === 0 ? (
            <p>No favorites yet</p>
          ) : (
            <div className="meals-grid">
              {favorites.map((meal) => (
                <div key={meal.id} className="recipe-card">
                  <img
                    src={meal.thumb}
                    alt={meal.name}
                    className="recipe-img"
                  />

                  <h3 className="recipe-title">{meal.name}</h3>

                  <p className="recipe-info">
                    <strong>Category:</strong> {meal.category}
                  </p>

                  <p className="recipe-info">
                    <strong>Area:</strong> {meal.area}
                  </p>

                  <a
                    href={meal.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="recipe-btn"
                  >
                    View Recipe ▶
                  </a>

                  <button
                    className="recipe-btn"
                    onClick={() => removeFavorite(meal.id)}
                  >
                    Remove ★
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= MODAL ================= */}
        {chosenMeal && (
          <div className="modal-overlay">
            <div className="modal-box small">
              <h2 className="modal-title">Add to {chosenMeal}</h2>
              <p className="modal-sub">Choose how to add:</p>

              <button className="option-btn" onClick={handleManualAdd}>
                Add Manually
              </button>

              <button className="option-btn" onClick={handleApiAdd}>
                Add via API
              </button>

              <button
                className="bottom-close"
                onClick={() => setChosenMeal(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;

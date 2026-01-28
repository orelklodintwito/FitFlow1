import { useState, useEffect } from "react";
import "../styles/homepage.css";
import "../styles/components.css";
import { useNavigate } from "react-router-dom";
import PageState from "../components/PageState";


import { useFavorites } from "../context/FavoritesContext.jsx";

// ⭐ REDUX
import { useSelector, useDispatch } from "react-redux";
import { toggleMode } from "../redux/themeSlice";

// ⭐ HOOK
import { useHomeDashboard } from "../hooks/useHomeDashboard";

function HomePage({ meals, openFoodSearch, openManualFood }) {
  const navigate = useNavigate();

  /* ============================== */
  /* REDUX */
  /* ============================== */
  const mode = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();

  /* ============================== */
  /* DASHBOARD HOOK */
  /* ============================== */
  const {
    allMeals,
    totalCalories,
    totalProtein,
    caloriesLeft,
    progressPercent,
    challengeTitle,
  } = useHomeDashboard(meals);
 /* ============================== */
/* PAGE STATE (Dashboard) */
/* ============================== */
let pageStatus = "ready";

if (!meals) {
  pageStatus = "loading";
}

if (pageStatus === "loading") {
  return <PageState status="loading" />;
}


  /* ============================== */
  /* FAVORITES */
  /* ============================== */
  const { favorites, removeFavorite } = useFavorites();

  /* ============================== */
  /* BMI */
  /* ============================== */
  const [height, setHeight] = useState(null);
  const [weight, setWeight] = useState(null);

  useEffect(() => {
  const profile = JSON.parse(localStorage.getItem("userProfile"));
  if (!profile) return;

  const key = profile.id
    ? `userMetrics_${profile.id}`
    : `userMetrics_${profile.email}`;

  const saved = JSON.parse(localStorage.getItem(key));
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

        {/* ================= CHALLENGE ================= */}
        <div className="dashboard-card">
          <h2>{challengeTitle}</h2>

          <div className="challenge-card-content">
            <div className="challenge-text">
              <p className="motivation-text">
                One step at a time today 🚀
              </p>
            </div>

            <button
              className="btn-green view-challenge-btn"
              onClick={() => navigate("/challenge")}
            >
              View Challenge →
            </button>
          </div>
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
                />
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
{allMeals.length === 0 && (
  <p className="small-text">No meals logged yet today</p>
)}

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
                />
              </div>

              <p className="bmi-value">
                {bmi ? bmi : "Not calculated"}
              </p>
            </div>

            <button
              className="btn-green"
              style={{ width: "100%", marginTop: "12px" }}
              onClick={() => navigate("/profile/edit")}
            >
              Edit Height & Weight
            </button>
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

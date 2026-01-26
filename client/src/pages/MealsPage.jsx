import { useState } from "react";
import { useLocation } from "react-router-dom";

import EditFoodModal from "../modals/EditFoodModal.jsx";
import "../styles/meals.css";
import "../styles/modal.css";

/* ===================== DATE HELPERS ===================== */
const startOfDay = (d) => {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
};

const startOfWeek = (d) => {
  const date = startOfDay(d);
  const day = date.getDay(); // 0 = Sunday
  date.setDate(date.getDate() - day);
  return date;
};

const startOfMonth = (d) => {
  const date = startOfDay(d);
  date.setDate(1);
  return date;
};

function MealsPage({
  meals = {}, // ⭐ הגנה מקריסה בטעינה
  openFoodSearch,
  openManualFood,
  onDelete,
  onReload,
}) {
  const [filter, setFilter] = useState("today");
  const [selectedMeal, setSelectedMeal] = useState(null);

  const location = useLocation();
  const dateFromChallenge = location.state?.date
    ? new Date(location.state.date)
    : null;

  /* ===================== FILTER BY DATE ===================== */
  const now = new Date();const baseDate = dateFromChallenge || new Date();


const filteredMeals = Object.fromEntries(
  Object.entries(meals).map(([mealName, list]) => [
    mealName,
    list.filter((food) => {
      const foodDate = new Date(food.date);

      // 👈 צפייה מ־Challenge ביום מסוים
      if (dateFromChallenge) {
        const start = startOfDay(dateFromChallenge);
        const end = new Date(start);
        end.setDate(end.getDate() + 1);
        return foodDate >= start && foodDate < end;
      }

      // 👇 מצב רגיל
      if (filter === "today") {
        return foodDate >= startOfDay(new Date());
      }

      if (filter === "week") {
        return foodDate >= startOfWeek(new Date());
      }

      if (filter === "month") {
        return foodDate >= startOfMonth(new Date());
      }

      return true;
    }),
  ])
);


  /* ===================== CALCULATIONS ===================== */
  const getCalories = (list) =>
    list.reduce((sum, f) => sum + Number(f.calories || 0), 0);

  const getProtein = (list) =>
    list.reduce((sum, f) => sum + Number(f.protein || 0), 0);

  /* ===================== ADD HANDLERS ===================== */
  const handleManualAdd = () => {
  if (!openManualFood) return;
  openManualFood(selectedMeal);
  setSelectedMeal(null);
};

const handleApiAdd = () => {
  if (!openFoodSearch) return;
  openFoodSearch(selectedMeal);
  setSelectedMeal(null);
};


  /* ===================== EDIT MODAL ===================== */
  const [editing, setEditing] = useState({
    open: false,
    food: null,
  });

  /* ===================== RENDER MEAL CARD ===================== */
  const renderMealSection = (mealName, title) => (
    <div className="dashboard-card meal-card" key={mealName}>
      <h2>{title}</h2>

      <p className="small-text">
        {getCalories(filteredMeals[mealName] || [])} kcal •{" "}
        {getProtein(filteredMeals[mealName] || [])} g protein
      </p>

      <button
        className="meal-add-btn"
        onClick={() => setSelectedMeal(mealName)}
      >
        ADD
      </button>

      {(filteredMeals[mealName] || []).length === 0 ? (
        <p className="meal-empty-text">No items yet.</p>
      ) : (
        filteredMeals[mealName].map((food) => (
          <div key={food._id} className="food-item">
            <div>
              <strong>{food.name}</strong>
              <p className="small-text">
                {food.calories} kcal • {food.protein || 0} g protein
              </p>
            </div>

            <div className="food-actions">
              <button onClick={() => setEditing({ open: true, food })}>
                ✏️
              </button>
              <button onClick={() => onDelete(food._id)}>❌</button>
            </div>
          </div>
        ))
      )}
    </div>
  );



  /* ===================== RENDER ===================== */
  return (
    <div className="dashboard">
      {/* HEADER + FILTER */}
      <div className="meals-header">
        <div className="meals-filter">
          {["today", "week", "month"].map((f) => (
            <button
              key={f}
              className={filter === f ? "active" : ""}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <h1>Meals</h1>
        <p className="small-text">
          Track your calories and protein for each meal
        </p>
      </div>

      {/* MEALS GRID */}
      <div className="meals-row">
        {renderMealSection("breakfast", "Breakfast")}
        {renderMealSection("lunch", "Lunch")}
        {renderMealSection("dinner", "Dinner")}
      </div>

      {/* ADD MODAL */}
      {selectedMeal && (
        <div className="modal-overlay">
          <div className="modal-box small">
            <h2>Add to {selectedMeal}</h2>

            <button onClick={handleManualAdd}>Add Manually</button>
            <button onClick={handleApiAdd}>Add via API</button>
            <button onClick={() => setSelectedMeal(null)}>Close</button>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editing.open && (
  <EditFoodModal
    food={editing.food}
    onClose={() => setEditing({ open: false, food: null })}
    onSuccess={onReload}   // ⭐ זה החיבור שחסר
  />
)}


    </div>
  );
}

export default MealsPage;

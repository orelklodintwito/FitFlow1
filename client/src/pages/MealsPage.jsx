import { useState } from "react";
import EditFoodModal from "../modals/EditFoodModal.jsx";
import "../styles/meals.css";
import "../styles/modal.css";

function MealsPage({
  meals,
  openFoodSearch,
  openManualFood,
  onDelete,
  onReload,
}) {
  const [filter, setFilter] = useState("today");
  const filteredMeals = meals;

  const getCalories = (list) =>
    list.reduce((sum, f) => sum + Number(f.calories || 0), 0);

  const getProtein = (list) =>
    list.reduce((sum, f) => sum + Number(f.protein || 0), 0);

  const [selectedMeal, setSelectedMeal] = useState(null);

  const handleManualAdd = () => {
    openManualFood(selectedMeal);
    setSelectedMeal(null);
  };

  const handleApiAdd = () => {
    openFoodSearch(selectedMeal);
    setSelectedMeal(null);
  };

  const [editing, setEditing] = useState({
    open: false,
    food: null,
  });

  const renderMealSection = (mealName, title) => (
    <div className="dashboard-card meal-card" key={mealName}>
      <h2>{title}</h2>

      <p className="small-text">
        {getCalories(filteredMeals[mealName])} kcal •{" "}
        {getProtein(filteredMeals[mealName])} g protein
      </p>

      <button
        className="meal-add-btn"
        onClick={() => setSelectedMeal(mealName)}
      >
        ADD
      </button>

      {filteredMeals[mealName].length === 0 ? (
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

  return (
    <div className="dashboard">
      <div className="meals-row">
        {renderMealSection("breakfast", "Breakfast")}
        {renderMealSection("lunch", "Lunch")}
        {renderMealSection("dinner", "Dinner")}
      </div>

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

      {editing.open && (
        <EditFoodModal
          food={editing.food}
          onClose={() => setEditing({ open: false, food: null })}
          onSuccess={onReload}
        />
      )}
    </div>
  );
}

export default MealsPage;

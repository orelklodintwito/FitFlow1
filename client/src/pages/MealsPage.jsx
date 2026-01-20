// src/pages/MealsPage.jsx
import React, { useState } from "react";
import EditFoodModal from "../modals/EditFoodModal.jsx";
import "../styles/meals.css";
import "../styles/modal.css";

function MealsPage({
  meals,
  openFoodSearch,
  openManualFood,
  removeFood,
  onEditFood,
}) {
  /* --------------------------------------------- */
  /* FILTER STATE */
  /* --------------------------------------------- */
  const [filter, setFilter] = useState("today");

  const getFilteredMeals = () => {
    return meals; // בעתיד אפשר להוסיף סינון
  };

  const filteredMeals = getFilteredMeals();

  /* --------------------------------------------- */
  /* CALCULATIONS */
  /* --------------------------------------------- */
  const getCalories = (list) =>
    list.reduce((sum, f) => sum + Number(f.calories || 0), 0);

  const getProtein = (list) =>
    list.reduce((sum, f) => sum + Number(f.protein || 0), 0);

  /* --------------------------------------------- */
  /* ADD MEAL MODAL */
  /* --------------------------------------------- */
  const [selectedMeal, setSelectedMeal] = useState(null);

  const openMealModal = (mealName) => setSelectedMeal(mealName);
  const closeMealModal = () => setSelectedMeal(null);

  const handleManualAdd = () => {
    openManualFood(selectedMeal);
    closeMealModal();
  };

  const handleApiAdd = () => {
    openFoodSearch(selectedMeal);
    closeMealModal();
  };

  /* --------------------------------------------- */
  /* EDIT FOOD MODAL */
  /* --------------------------------------------- */
  const [editing, setEditing] = useState({
    open: false,
    meal: "",
    index: null,
    food: null,
  });

  const openEditModal = (meal, index, food) => {
    setEditing({
      open: true,
      meal,
      index,
      food,
    });
  };

  const closeEditModal = () => {
    setEditing({
      open: false,
      meal: "",
      index: null,
      food: null,
    });
  };

  /* --------------------------------------------- */
  /* RENDER MEAL CARD */
  /* --------------------------------------------- */
  const renderMealSection = (mealName, title) => (
    <div className="dashboard-card meal-card" key={mealName}>
      <h2>{title}</h2>

      <p className="small-text">
        {getCalories(filteredMeals[mealName])} kcal •{" "}
        {getProtein(filteredMeals[mealName])} g protein
      </p>

      <div className="meal-actions">
        <button className="meal-add-btn" onClick={() => openMealModal(mealName)}>
          ADD
        </button>
      </div>

      {filteredMeals[mealName].length === 0 ? (
        <p className="meal-empty-text">No items yet.</p>
      ) : (
        filteredMeals[mealName].map((food, index) => (
          <div key={index} className="food-item">
            <div>
              <strong>{food.name}</strong>
              <p className="small-text">
                {food.calories} kcal • {food.protein || 0} g protein
              </p>
            </div>

            <div className="food-actions">
              <button
                className="edit-btn"
                onClick={() => openEditModal(mealName, index, food)}
              >
                ✏️
              </button>

              <button
                className="remove-btn"
                onClick={() => removeFood(mealName, index)}
              >
                ❌
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
  /* --------------------------------------------- */
  /* PAGE RENDER */
  /* --------------------------------------------- */

  return (
    <div className="dashboard">

      {/* FILTER BAR */}
      <div className="wide-card">
        <div className="dashboard-filter">
          <div className="filter-buttons">
            <button
              className={filter === "today" ? "active" : ""}
              onClick={() => setFilter("today")}
            >
              Today
            </button>

            <button
              className={filter === "week" ? "active" : ""}
              onClick={() => setFilter("week")}
            >
              Week
            </button>

            <button
              className={filter === "month" ? "active" : ""}
              onClick={() => setFilter("month")}
            >
              Month
            </button>
          </div>
        </div>
      </div>

      {/* PAGE HEADER */}
      <div className="dashboard-card wide-card">
        <h2 style={{ textAlign: "center" }}>Meals</h2>
        <p className="small-text" style={{ textAlign: "center" }}>
          Track your calories and protein for each meal.
        </p>
      </div>

      {/* MEAL CARDS GRID */}
      <div className="meals-row">
        {renderMealSection("breakfast", "Breakfast")}
        {renderMealSection("lunch", "Lunch")}
        {renderMealSection("dinner", "Dinner")}
      </div>

      {/* ADD MEAL BUTTON */}
      <div className="add-meal-wrapper">
        <button
          className="floating-add-meal"
          onClick={() => openMealModal("breakfast")}
        >
          + Add Meal
        </button>
      </div>

      {/* ADD OPTIONS MODAL */}
      {selectedMeal && (
        <div className="modal-overlay">
          <div className="modal-box small">
            <h2 className="modal-title">Add to {selectedMeal}</h2>
            <p className="modal-sub">Choose how to add:</p>

            <button className="option-btn" onClick={handleManualAdd}>
              Add Manually
            </button>

            <button className="option-btn" onClick={handleApiAdd}>
              Add via API
            </button>

            <button className="modal-btn gray" onClick={closeMealModal}>
               Close
            </button>

          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editing.open && (
        <EditFoodModal
          food={editing.food}
          mealType={editing.meal}
          index={editing.index}
          onSave={onEditFood}
          onClose={closeEditModal}
        />
      )}
    </div>
  );
}

export default MealsPage;

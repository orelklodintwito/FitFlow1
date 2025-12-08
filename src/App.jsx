// src/App.jsx
import { useState, useEffect } from "react";
import Header from "./components/Header.jsx";

import HomePage from "./pages/HomePage.jsx";
import MealsPage from "./pages/MealsPage.jsx";
import ApiPage from "./pages/ApiPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

import FoodSearchModal from "./modals/FoodSearchModal.jsx";
import ManualFoodModal from "./modals/ManualFoodModal.jsx";

// ----------- STYLES -----------
import "./styles/global.css";
import "./styles/header.css";
import "./styles/layout.css";
import "./styles/homepage.css";
import "./styles/meals.css";
import "./styles/buttons.css";
import "./styles/modal.css";
import "./styles/auth.css";
import "./styles/components.css";
import "./styles/api.css";
// --------------------------------

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [page, setPage] = useState("home");
  const [showSignup, setShowSignup] = useState(false);

  const [meals, setMeals] = useState({
    breakfast: [],
    lunch: [],
    dinner: []
  });

  /* AUTH PAGE BACKGROUND HANDLING */
  useEffect(() => {
    if (!isLoggedIn) {
      document.body.classList.add("auth-page");
    } else {
      document.body.classList.remove("auth-page");
    }
  }, [isLoggedIn]);

  /* LOAD MEALS FROM LOCAL STORAGE */
  useEffect(() => {
    const saved = localStorage.getItem("meals");
    if (saved) setMeals(JSON.parse(saved));
  }, []);

  /* SAVE MEALS TO LOCAL STORAGE */
  useEffect(() => {
    localStorage.setItem("meals", JSON.stringify(meals));
  }, [meals]);

  const today = () => new Date().toISOString().split("T")[0];

  /* ADD FOOD (MANUAL) */
  const addFoodManual = (mealType, food) => {
    setMeals(prev => ({
      ...prev,
      [mealType]: [...prev[mealType], { ...food, date: today() }]
    }));
  };

  /* ADD FOOD (API) */
  const addFoodFromApi = (mealType, foodObj) => {
    setMeals(prev => ({
      ...prev,
      [mealType]: [...prev[mealType], { ...foodObj, date: today() }]
    }));
  };

  /* REMOVE FOOD */
  const removeFood = (mealType, index) => {
    setMeals(prev => {
      const updated = [...prev[mealType]];
      updated.splice(index, 1);
      return { ...prev, [mealType]: updated };
    });
  };

  /* -------------- NEW: EDIT FOOD -------------- */
  const editFood = (mealType, index, newFood) => {
    setMeals(prev => {
      const updated = [...prev[mealType]];
      updated[index] = newFood;
      return { ...prev, [mealType]: updated };
    });
  };
  /* ---------------------------------------------- */

  const [mealType, setMealType] = useState("");

  const [showApiModal, setShowApiModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);

  const openFoodSearch = meal => {
    setMealType(meal);
    setShowApiModal(true);
  };

  const openManualFood = meal => {
    setMealType(meal);
    setShowManualModal(true);
  };

  /* ---------------- LOGIN MODE ---------------- */
  if (!isLoggedIn) {
    return showSignup ? (
      <Signup setShowSignup={setShowSignup} setIsLoggedIn={setIsLoggedIn} />
    ) : (
      <Login setShowSignup={setShowSignup} setIsLoggedIn={setIsLoggedIn} />
    );
  }

  return (
    <div className="app-container">
      <Header page={page} setPage={setPage} setIsLoggedIn={setIsLoggedIn} />

      <main className={`main-content ${page === "home" ? "home-bg" : ""}`}>

        {page === "home" && (
          <HomePage
            meals={meals}
            openFoodSearch={openFoodSearch}
            openManualFood={openManualFood}
          />
        )}

        {page === "meals" && (
          <MealsPage
            meals={meals}
            removeFood={removeFood}
            openFoodSearch={openFoodSearch}
            openManualFood={openManualFood}
            onEditFood={editFood}  
          />
        )}

        {page === "recipes" && <ApiPage />}
        {page === "settings" && <SettingsPage />}
      </main>

      {/* API MODAL */}
      {showApiModal && (
        <FoodSearchModal
          meal={mealType}
          onClose={() => setShowApiModal(false)}
          onAddFood={addFoodFromApi}
        />
      )}

      {/* MANUAL MODAL */}
      {showManualModal && (
        <ManualFoodModal
          meal={mealType}
          onClose={() => setShowManualModal(false)}
          onSave={addFoodManual}
        />
      )}
    </div>
  );
}

export default App;

// src/App.jsx
import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

// ⭐ Custom Hook – REQUIRED (Part 1)
import { useLocalStorage } from "./hooks/useLocalStorage";

import Header from "./components/Header.jsx";

import HomePage from "./pages/HomePage.jsx";
import MealsPage from "./pages/MealsPage.jsx";
import ApiPage from "./pages/ApiPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import NotFound from "./pages/NotFound.jsx";

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
  /* ====================================================== */
  /* LOGIN – Persisted via useLocalStorage (Part 1 ✔️) */
  /* ====================================================== */
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage("isLoggedIn", false);
  const [showSignup, setShowSignup] = useState(false);
  const navigate = useNavigate();

  /* ====================================================== */
  /* MEALS – Persisted via useLocalStorage (Part 1 ✔️) */
  /* ====================================================== */
  const [meals, setMeals] = useLocalStorage("meals", {
    breakfast: [],
    lunch: [],
    dinner: []
  });

  const today = () => new Date().toISOString().split("T")[0];

  const addFoodManual = (mealType, food) => {
    setMeals(prev => ({
      ...prev,
      [mealType]: [...prev[mealType], { ...food, date: today() }]
    }));
  };

  const addFoodFromApi = (mealType, foodObj) => {
    setMeals(prev => ({
      ...prev,
      [mealType]: [...prev[mealType], { ...foodObj, date: today() }]
    }));
  };

  const removeFood = (mealType, index) => {
    setMeals(prev => {
      const updated = [...prev[mealType]];
      updated.splice(index, 1);
      return { ...prev, [mealType]: updated };
    });
  };

  const editFood = (mealType, index, newFood) => {
    setMeals(prev => {
      const updated = [...prev[mealType]];
      updated[index] = newFood;
      return { ...prev, [mealType]: updated };
    });
  };

  /* ====================================================== */
  /* MODALS */
  /* ====================================================== */
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

  /* ====================================================== */
  /* AUTH BACKGROUND – unchanged */
  /* ====================================================== */
  useEffect(() => {
    if (!isLoggedIn) document.body.classList.add("auth-page");
    else document.body.classList.remove("auth-page");
  }, [isLoggedIn]);

  /* ====================================================== */
  /* LOGIN MODE – unchanged */
  /* ====================================================== */
  if (!isLoggedIn) {
    return showSignup ? (
      <Signup setShowSignup={setShowSignup} setIsLoggedIn={setIsLoggedIn} />
    ) : (
      <Login setShowSignup={setShowSignup} setIsLoggedIn={setIsLoggedIn} />
    );
  }

  /* ====================================================== */
  /* APP */
  /* ====================================================== */
  return (
    <div className="app-container">
      <Header setIsLoggedIn={setIsLoggedIn} />

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                meals={meals}
                openFoodSearch={openFoodSearch}
                openManualFood={openManualFood}
              />
            }
          />

          <Route
            path="/form"
            element={
              <MealsPage
                meals={meals}
                removeFood={removeFood}
                openFoodSearch={openFoodSearch}
                openManualFood={openManualFood}
                onEditFood={editFood}
              />
            }
          />

          <Route path="/api" element={<ApiPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* ✅ 404 – REQUIRED */}
          <Route
            path="*"
            element={<NotFound goHome={() => navigate("/")} />}
          />
        </Routes>
      </main>

      {showApiModal && (
        <FoodSearchModal
          meal={mealType}
          onClose={() => setShowApiModal(false)}
          onAddFood={addFoodFromApi}
        />
      )}

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

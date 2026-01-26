// src/App.jsx
import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// ⭐ API
import { getMeals, deleteMeal } from "./services/meals";

import Header from "./components/Header.jsx";
import ChallengePage from "./pages/ChallengePage.jsx";

import HomePage from "./pages/HomePage.jsx";
import MealsPage from "./pages/MealsPage.jsx";
import ApiPage from "./pages/ApiPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import EditProfilePage from "./pages/EditProfilePage.jsx";
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
  /* AUTH – מבוסס token */
  /* ====================================================== */
  

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("token");
  });

  const [showSignup, setShowSignup] = useState(false);
  const navigate = useNavigate();

  // אם token נמחק/נוסף מבחוץ, נוודא sync בסיסי
  useEffect(() => {
    const syncAuth = () => setIsLoggedIn(!!localStorage.getItem("token"));
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  /* ====================================================== */
  /* MEALS – מגיעים מהשרת */
  /* ====================================================== */
  const [meals, setMeals] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
  });

  const reloadMealsFromServer = async () => {
    try {
      const res = await getMeals();

      const grouped = {
        breakfast: [],
        lunch: [],
        dinner: [],
      };

      res.data.forEach((meal) => {
        if (grouped[meal.mealType]) {
          grouped[meal.mealType].push(meal);
        }
      });

      setMeals(grouped);
    } catch (err) {
      console.error("❌ Failed to load meals", err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      reloadMealsFromServer();
    }
  }, [isLoggedIn]);

  /* ====================================================== */
  /* DELETE MEAL */
  /* ====================================================== */
  const handleDeleteMeal = async (id) => {
    try {
      await deleteMeal(id);
      reloadMealsFromServer();
    } catch (err) {
      console.error("❌ Failed to delete meal", err);
    }
  };

  /* ====================================================== */
  /* MODALS */
  /* ====================================================== */
  const [mealType, setMealType] = useState("");
  const [showApiModal, setShowApiModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);

  const openFoodSearch = (meal) => {
    setMealType(meal);
    setShowApiModal(true);
  };

  const openManualFood = (meal) => {
    setMealType(meal);
    setShowManualModal(true);
  };

  /* ====================================================== */
  /* AUTH BACKGROUND */
  /* ====================================================== */
  useEffect(() => {
    if (!isLoggedIn) document.body.classList.add("auth-page");
    else document.body.classList.remove("auth-page");
  }, [isLoggedIn]);

  /* ====================================================== */
  /* LOGIN MODE */
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
      <Header
  onLogout={() => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);

    // 🔥 איפוס מלא של נתוני משתמש
    setMeals({
      breakfast: [],
      lunch: [],
      dinner: [],
    });
  }}
/>


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
                openFoodSearch={openFoodSearch}
                openManualFood={openManualFood}
                onDelete={handleDeleteMeal}
              />
            }
          />

          <Route path="/api" element={<ApiPage />} />

          {/* 👤 PROFILE */}
          <Route
            path="/profile"
            element={<SettingsPage setIsLoggedIn={setIsLoggedIn} />}
          />

          <Route path="/profile/edit" element={<EditProfilePage />} />

          {/* 🏆 CHALLENGE */}
          <Route path="/challenge" element={<ChallengePage meals={meals} />} />

          {/* ❌ 404 */}
          <Route path="*" element={<NotFound goHome={() => navigate("/")} />} />
        </Routes>
      </main>

      {/* ===== API MODAL ===== */}
      {showApiModal && (
        <FoodSearchModal
          meal={mealType}
          onClose={() => setShowApiModal(false)}
          onSuccess={reloadMealsFromServer}
        />
      )}

      {/* ===== MANUAL MODAL ===== */}
      {showManualModal && (
        <ManualFoodModal
          meal={mealType}
          onClose={() => setShowManualModal(false)}
          onSuccess={reloadMealsFromServer}
        />
      )}
    </div>
  );
}

export default App;
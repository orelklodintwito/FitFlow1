// src/App.jsx
import { Routes, Route, useNavigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

import { getMeals, deleteMeal } from "./services/meals";
import Header from "./components/Header.jsx";
import ChallengePage from "./pages/ChallengePage.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";
import HomePage from "./pages/HomePage.jsx";
import MealsPage from "./pages/MealsPage.jsx";
import ApiPage from "./pages/ApiPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import EditProfilePage from "./pages/EditProfilePage.jsx";
import NotFound from "./pages/NotFound.jsx";

import AdminRouteGuard from "./admin/AdminRouteGuard.jsx";
import AdminLayout from "./admin/AdminLayout.jsx";
import AdminUsers from "./admin/AdminUsers.jsx";

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
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("token");
  });

  const [showSignup, setShowSignup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const syncAuth = () => setIsLoggedIn(!!localStorage.getItem("token"));
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

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

  const handleDeleteMeal = async (id) => {
    try {
      await deleteMeal(id);
      reloadMealsFromServer();
    } catch (err) {
      console.error("❌ Failed to delete meal", err);
    }
  };

  const [mealType, setMealType] = useState("");
  const [showApiModal, setShowApiModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);

  const [challengeDayForModal, setChallengeDayForModal] = useState(null);

const openManualFood = (meal, challengeDayId = null) => {
  setMealType(meal);
  setChallengeDayForModal(challengeDayId);
  setShowManualModal(true);
};

const openFoodSearch = (meal, challengeDayId = null) => {
  setMealType(meal);
  setChallengeDayForModal(challengeDayId);
  setShowApiModal(true);
};

  useEffect(() => {
    if (!isLoggedIn) document.body.classList.add("auth-page");
    else document.body.classList.remove("auth-page");
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return showSignup ? (
      <Signup setShowSignup={setShowSignup} setIsLoggedIn={setIsLoggedIn} />
    ) : (
      <Login setShowSignup={setShowSignup} setIsLoggedIn={setIsLoggedIn} />
    );
  }

  return (
    <div className="app-container">
      <Routes>

        {/* ================= USER LAYOUT ================= */}
        <Route
          element={
            <>
              <Header
                onLogout={() => {
                  localStorage.removeItem("token");
                  setIsLoggedIn(false);
                  setMeals({
                    breakfast: [],
                    lunch: [],
                    dinner: [],
                  });
                }}
              />
              <main className="main-content">
                <Outlet />
              </main>
            </>
          }
        >
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
                onReload={reloadMealsFromServer}
              />
            }
          />

          <Route path="/api" element={<ApiPage />} />
          <Route
            path="/profile"
            element={<SettingsPage setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route path="/profile/edit" element={<EditProfilePage />} />
          <Route
            path="/challenge"
            element={<ChallengePage meals={meals} />}
          />
        </Route>

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin"
          element={
            <AdminRouteGuard>
              <AdminLayout />
            </AdminRouteGuard>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        {/* ================= 404 ================= */}
        <Route
          path="*"
          element={<NotFound goHome={() => navigate("/")} />}
        />

      </Routes>

      {/* ===== MODALS ===== */}
      {showApiModal && (
        <FoodSearchModal
          meal={mealType}
          challengeDayId={challengeDayForModal}
          onClose={() => setShowApiModal(false)}
          onSuccess={reloadMealsFromServer}
        />
      )}

      {showManualModal && (
        <ManualFoodModal
          meal={mealType}
          challengeDayId={challengeDayForModal}
          onClose={() => setShowManualModal(false)}
          onSuccess={reloadMealsFromServer}
        />
      )}

    </div>
  );
}

export default App;
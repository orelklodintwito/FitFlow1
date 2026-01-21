const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Meal = require("../models/Meal");

const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin"); // ✅ תיקון קריטי

// 🧑‍💼 כל המשתמשים
router.get("/users", auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 👤 פרטי משתמש
router.get("/users/:id", auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: "Invalid user ID" });
  }
});

// 🍽️ כל הארוחות של משתמש
router.get("/users/:id/meals", auth, isAdmin, async (req, res) => {
  try {
    const meals = await Meal.find({ user: req.params.id }).sort({ date: -1 });
    res.status(200).json(meals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 👤 פרופיל משתמש מלא + סטטיסטיקות (Admin)
router.get("/users/:id/full", auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const meals = await Meal.find({ user: req.params.id }).sort({ date: -1 });

    const totalCalories = meals.reduce(
      (sum, meal) => sum + (meal.calories || 0),
      0
    );

    res.status(200).json({
      user,
      meals,
      stats: {
        mealsCount: meals.length,
        totalCalories,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

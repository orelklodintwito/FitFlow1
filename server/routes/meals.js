const express = require("express");
const router = express.Router();

const Meal = require("../models/Meal");
const auth = require("../middleware/auth");

/* ===================== CREATE ===================== */
// POST – הוספת ארוחה (משתמש לעצמו בלבד)
router.post("/", auth, async (req, res) => {
  try {
    const meal = await Meal.create({
      ...req.body,
      user: req.userId, // 👈 תיקון קריטי
    });

    res.status(201).json(meal);
  } catch (err) {
    res.status(400).json({ message: "Failed to create meal" });
  }
});

/* ===================== READ ===================== */
// GET – קבלת ארוחות
router.get("/", auth, async (req, res) => {
  try {
    let meals;

    // 🛡️ אדמין – יכול לראות ארוחות של משתמש ספציפי
    if (req.role === "admin" && req.query.userId) {
      meals = await Meal.find({ user: req.query.userId })
        .populate("user", "email name role")
        .sort({ date: -1 });
    }
    // 👤 משתמש רגיל – רק הארוחות שלו
    else {
      meals = await Meal.find({ user: req.userId }).sort({ date: -1 });
    }

    res.status(200).json(meals);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch meals" });
  }
});

module.exports = router;

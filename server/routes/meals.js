const express = require("express");
const router = express.Router();

const Meal = require("../models/Meal");
const auth = require("../middleware/auth");

/* ===================== CREATE ===================== */
// POST /api/meals
// יצירת ארוחה חדשה – רק למשתמש המחובר
router.post("/", auth, async (req, res) => {
  try {
    const meal = await Meal.create({
      ...req.body,
      user: req.userId, // 🔐 קישור הארוחה למשתמש
    });

    res.status(201).json(meal);
  } catch (err) {
    res.status(400).json({ message: "Failed to create meal" });
  }
});

/* ===================== READ ===================== */
// GET /api/meals
// קבלת כל הארוחות של המשתמש
router.get("/", auth, async (req, res) => {
  try {
    let meals;

    // 👑 אדמין – יכול לבקש ארוחות של משתמש אחר
    if (req.role === "admin" && req.query.userId) {
      meals = await Meal.find({ user: req.query.userId })
        .populate("user", "email name role")
        .sort({ date: -1 });
    } 
    // 👤 משתמש רגיל – רק שלו
    else {
      meals = await Meal.find({ user: req.userId }).sort({ date: -1 });
    }

    res.status(200).json(meals);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch meals" });
  }
});

/* ===================== UPDATE ===================== */
// PUT /api/meals/:id
// עריכת ארוחה – רק של המשתמש
router.put("/:id", auth, async (req, res) => {
  try {
    const meal = await Meal.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );

    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    res.status(200).json(meal);
  } catch (err) {
    res.status(500).json({ message: "Failed to update meal" });
  }
});

/* ===================== DELETE ===================== */
// DELETE /api/meals/:id
// מחיקת ארוחה – רק של המשתמש
router.delete("/:id", auth, async (req, res) => {
  try {
    const meal = await Meal.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    res.status(200).json({ message: "Meal deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete meal" });
  }
});

module.exports = router;

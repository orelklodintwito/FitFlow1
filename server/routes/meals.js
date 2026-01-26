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
  calories: Number(req.body.calories),
  user: req.user.id,
});


    res.status(201).json(meal);
  } catch (err) {
  console.error("❌ CREATE MEAL ERROR:", err);
  res.status(400).json({ message: err.message });
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
      meals = await Meal.find({ user: req.user.id }).sort({ date: -1 });
    }

    res.status(200).json(meals);
  } catch (err) {
    console.error("❌ FETCH MEALS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch meals" });
  }
});

/* ===================== UPDATE ===================== */
// PUT /api/meals/:id
// עריכת ארוחה – רק של המשתמש
router.put("/:id", auth, async (req, res) => {
  try {
    const meal = await Meal.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id }, // ✅ תואם auth.js
      req.body,
      { new: true }
    );

    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    res.status(200).json(meal);
  } catch (err) {
    console.error("❌ UPDATE MEAL ERROR:", err);
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
      user: req.user.id, // ✅ תואם auth.js
    });

    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    res.status(200).json({ message: "Meal deleted" });
  } catch (err) {
    console.error("❌ DELETE MEAL ERROR:", err);
    res.status(500).json({ message: "Failed to delete meal" });
  }
});

module.exports = router;

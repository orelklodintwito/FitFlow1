const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const auth = require("../middleware/auth");

const Workout = require("../models/Workout");
const Challenge = require("../models/Challenge");
const ChallengeDay = require("../models/ChallengeDay");

/* ===================== CREATE ===================== */
// POST /api/workouts
// יצירת אימון ליום הנוכחי
router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { type, duration, calories } = req.body;

    if (!type || !duration) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const challenge = await Challenge.findOne({ user: userId });
    if (!challenge) {
      return res.status(404).json({ message: "No active challenge" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const challengeDay = await ChallengeDay.findOne({
      challenge: challenge._id,
      date: today,
    });

    if (!challengeDay) {
      return res.status(404).json({ message: "No active challenge day" });
    }

    const workout = await Workout.create({
      user: userId,
      challengeDay: challengeDay._id,
      type,
      duration: Number(duration),
      calories: calories ? Number(calories) : 0,
    });

    res.status(201).json(workout);
  } catch (err) {
    console.error("❌ CREATE WORKOUT ERROR:", err);
    res.status(400).json({ message: "Failed to create workout" });
  }
});

/* ===================== READ ===================== */
// GET /api/workouts
// קבלת כל האימונים של המשתמש (של היום)
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { challengeDayId } = req.query;

    let query = { user: userId };

    if (challengeDayId) {
      // 🔹 מצב: מסתכלים על יום בצ'אלנג'
      query.challengeDay = challengeDayId;
    } else {
      // 🔹 fallback: היום האמיתי
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      query.createdAt = {
        $gte: today,
        $lt: tomorrow,
      };
    }

    const workouts = await Workout.find(query).sort({ createdAt: -1 });

    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching workouts" });
  }
});


/* ===================== UPDATE ===================== */
// PUT /api/workouts/:id
// עריכת אימון
router.put("/:id", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      req.body,
      { new: true }
    );

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    res.status(200).json(workout);
  } catch (err) {
    console.error("❌ UPDATE WORKOUT ERROR:", err);
    res.status(500).json({ message: "Failed to update workout" });
  }
});

/* ===================== DELETE ===================== */
// DELETE /api/workouts/:id
// מחיקת אימון
router.delete("/:id", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    res.status(200).json({ message: "Workout deleted" });
  } catch (err) {
    console.error("❌ DELETE WORKOUT ERROR:", err);
    res.status(500).json({ message: "Failed to delete workout" });
  }
});

module.exports = router;

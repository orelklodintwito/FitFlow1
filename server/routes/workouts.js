const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Workout = require("../models/Workout");
const Challenge = require("../models/Challenge");
const ChallengeDay = require("../models/ChallengeDay");

// ⚠️ אם יש לך auth middleware – תחברי אותו כאן
// const auth = require("../middleware/auth");

/**
 * POST /api/workouts
 * הוספת אימון ליום הנוכחי
 */
router.post("/", async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { type, duration, calories } = req.body;

    if (!type || !duration) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // מציאת אתגר פעיל
    const challenge = await Challenge.findOne({ user: userId });
    if (!challenge) {
      return res.status(404).json({ message: "No active challenge" });
    }

    // היום הנוכחי (00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // מציאת יום אתגר
    const challengeDay = await ChallengeDay.findOne({
      challenge: challenge._id,
      date: today,
    });

    if (!challengeDay) {
      return res.status(404).json({ message: "No active challenge day" });
    }

    // יצירת אימון
    const workout = new Workout({
      user: userId,
      challengeDay: challengeDay._id,
      type,
      duration,
      calories: calories || 0,
    });

    await workout.save();

    return res.status(201).json(workout);
  } catch (err) {
    console.error("❌ Error saving workout:", err);
    return res.status(500).json({ message: "Failed to save workout" });
  }
});

module.exports = router;

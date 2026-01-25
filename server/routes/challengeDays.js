const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Challenge = require("../models/Challenge");
const ChallengeDay = require("../models/ChallengeDay");
const Workout = require("../models/Workout");
const CHALLENGE_RULES = require("../challenges/challengeRules");

/**
 * GET /api/challenge-day/today
 * מחזיר את היום הנוכחי, ואם אין – יוצר יום חדש
 * ❗ לא יוצר ימים מעבר ל-durationDays
 */
router.get("/today", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const challenge = await Challenge.findOne({ user: userId });
    if (!challenge) return res.json(null);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let day = await ChallengeDay.findOne({
      challenge: challenge._id,
      date: today,
    });

    if (!day) {
      const lastDay = await ChallengeDay.findOne({
        challenge: challenge._id,
      }).sort({ dayNumber: -1 });

      // ⛔ לא יוצרים ימים מעבר למשך האתגר
      if (
        lastDay &&
        challenge.durationDays &&
        lastDay.dayNumber >= challenge.durationDays
      ) {
        return res.json(lastDay);
      }

      day = await ChallengeDay.create({
        challenge: challenge._id,
        date: today,
        dayNumber: lastDay ? lastDay.dayNumber + 1 : 1,
        failed: false,
        completed: false,
      });
    }

    return res.json(day);
  } catch (err) {
    console.error("Error fetching today challenge day:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/challenge-day
 * שמירת נתוני יום + חישוב השלמה
 */
router.post("/", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const challenge = await Challenge.findOne({ user: userId });
    if (!challenge) {
      return res.status(404).json({ message: "No active challenge found" });
    }

    // חוקים – preset או custom
    let rules;
    if (challenge.type === "custom") {
      rules = {
        waterLiters: challenge.goals.water,
        readingPages: challenge.goals.reading,
        workouts: challenge.goals.workouts
          ? { minMinutes: 1 }
          : null,
      };
    } else {
      rules = CHALLENGE_RULES[challenge.type];
    }

    if (!rules) {
      return res.status(400).json({ message: "Invalid challenge rules" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const day = await ChallengeDay.findOne({
      challenge: challenge._id,
      date: today,
    });

    if (!day) {
      return res.status(404).json({ message: "No active day found" });
    }

    // ===== Inputs =====
    if (typeof req.body.waterLiters === "number") {
      day.waterLiters = req.body.waterLiters;
    }

    if (typeof req.body.readingPages === "number") {
      day.readingPages = req.body.readingPages;
    }

    // ===== Checks =====
    day.waterCompleted =
      typeof rules.waterLiters === "number" &&
      day.waterLiters >= rules.waterLiters;

    day.readingCompleted =
      typeof rules.readingPages === "number" &&
      day.readingPages >= rules.readingPages;

    // אימונים
    let workoutsCompleted = true;
    if (rules.workouts && rules.workouts.minMinutes) {
      const workouts = await Workout.find({ challengeDay: day._id });
      workoutsCompleted = workouts.some(
        (w) => w.duration >= rules.workouts.minMinutes
      );
    }
    day.workoutsCompleted = workoutsCompleted;

    // תזונה – זמנית true
    day.nutritionCompleted = true;

    day.completed =
      day.waterCompleted &&
      day.readingCompleted &&
      day.workoutsCompleted &&
      day.nutritionCompleted;

    day.failed = false;

    await day.save();
    return res.json(day);
  } catch (err) {
    console.error("Error saving challenge day:", err);
    return res.status(500).json({ message: "Failed to save progress" });
  }
});

/**
 * GET /api/challenge-day
 * מחזיר את כל הימים של האתגר
 */
router.get("/", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "No user" });

    const challenge = await Challenge.findOne({ user: userId });
    if (!challenge) return res.json([]);

    const days = await ChallengeDay.find({ challenge: challenge._id }).sort({
      dayNumber: 1,
    });

    return res.json(days);
  } catch (err) {
    return res.status(500).json({ message: "Failed to load challenge days" });
  }
});

/**
 * GET /api/challenge-day/:dayNumber
 * מחזיר יום ספציפי (ימים אחורה)
 */
router.get("/:dayNumber", async (req, res) => {
  try {
    const userId = req.user?.id;
    const dayNumber = Number(req.params.dayNumber);

    if (
      !userId ||
      !mongoose.Types.ObjectId.isValid(userId) ||
      !Number.isInteger(dayNumber) ||
      dayNumber < 1
    ) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const challenge = await Challenge.findOne({ user: userId });
    if (!challenge) {
      return res.status(404).json({ message: "No active challenge found" });
    }

    const lastDay = await ChallengeDay.findOne({
      challenge: challenge._id,
    }).sort({ dayNumber: -1 });

    if (!lastDay || dayNumber > lastDay.dayNumber) {
      return res.status(403).json({ message: "Day not available yet" });
    }

    const day = await ChallengeDay.findOne({
      challenge: challenge._id,
      dayNumber,
    });

    if (!day) {
      return res.status(404).json({ message: "Day not found" });
    }

    return res.json(day);
  } catch (err) {
    console.error("Error fetching challenge day by number:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const auth = require("../middleware/auth");
const Challenge = require("../models/Challenge");
const ChallengeDay = require("../models/ChallengeDay");
const Workout = require("../models/Workout");
const CHALLENGE_RULES = require("../challenges/challengeRules");

/**
 * GET /api/challenge-day/today
 */
router.get("/today", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
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
 */
router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const challenge = await Challenge.findOne({ user: userId });
    if (!challenge) {
      return res.status(404).json({ message: "No active challenge found" });
    }

    const rules =
      challenge.type === "custom"
        ? {
            waterLiters: challenge.goals?.water,
            readingPages: challenge.goals?.reading,
            workouts: challenge.goals?.workouts
              ? { minMinutes: 1 }
              : null,
          }
        : CHALLENGE_RULES[challenge.type];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const day = await ChallengeDay.findOne({
      challenge: challenge._id,
      date: today,
    });

    if (!day) {
      return res.status(404).json({ message: "No active day found" });
    }

    /* ---------- SAVE RAW VALUES ---------- */
    if (typeof req.body.waterLiters === "number") {
      day.waterLiters = req.body.waterLiters;
    }

    if (typeof req.body.readingPages === "number") {
      day.readingPages = req.body.readingPages;
    }

    /* ---------- WATER ---------- */
    if (typeof rules.waterLiters === "number") {
      day.waterCompleted =
        typeof day.waterLiters === "number" &&
        day.waterLiters >= rules.waterLiters;
    } else {
      day.waterCompleted = true;
    }

    /* ---------- READING ---------- */
    if (typeof rules.readingPages === "number") {
      day.readingCompleted =
        typeof day.readingPages === "number" &&
        day.readingPages >= rules.readingPages;
    } else {
      day.readingCompleted = true;
    }

    /* ---------- WORKOUT ---------- */
    if (rules.workouts?.minMinutes) {
      const workouts = await Workout.find({ challengeDay: day._id });
      day.workoutsCompleted = workouts.some(
        (w) => w.duration >= rules.workouts.minMinutes
      );
    } else {
      day.workoutsCompleted = true;
    }

    /* ---------- NUTRITION ---------- */
    day.nutritionCompleted = true;

    /* ---------- FINAL STATUS ---------- */
  /* ---------- FINAL STATUS ---------- */
// completed = האם כל 4 המרכיבים בוצעו
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
 */
router.get("/", auth, async (req, res) => {
  try {
    const challenge = await Challenge.findOne({ user: req.user.id });
    if (!challenge) return res.json([]);

    const days = await ChallengeDay.find({
      challenge: challenge._id,
    }).sort({ dayNumber: 1 });

    return res.json(days);
  } catch {
    return res.status(500).json({ message: "Failed to load challenge days" });
  }
});

/**
 * GET /api/challenge-day/:dayNumber
 */
router.get("/:dayNumber", auth, async (req, res) => {
  try {
    const dayNumber = Number(req.params.dayNumber);

    const challenge = await Challenge.findOne({ user: req.user.id });
    if (!challenge) {
      return res.status(404).json({ message: "No active challenge found" });
    }

    const day = await ChallengeDay.findOne({
      challenge: challenge._id,
      dayNumber,
    });

    if (!day) {
      return res.status(404).json({ message: "Day not found" });
    }

    return res.json(day);
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

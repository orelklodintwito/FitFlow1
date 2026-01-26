const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const auth = require("../middleware/auth");
const Challenge = require("../models/Challenge");
const ChallengeDay = require("../models/ChallengeDay");

/**
 * GET /api/challenge
 * מחזיר את האתגר הפעיל + היום הנוכחי של המשתמש
 */
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const challenge = await Challenge.findOne({ user: userId });
    if (!challenge) {
      return res.json(null);
    }

    // 📅 היום הנוכחי (00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let day = await ChallengeDay.findOne({
      challenge: challenge._id,
      user: userId,
      date: today,
    });

    // אם אין יום – ניצור
    if (!day) {
      const lastDay = await ChallengeDay.findOne({
        challenge: challenge._id,
        user: userId,
      }).sort({ dayNumber: -1 });

      day = await ChallengeDay.create({
        challenge: challenge._id,
        user: userId,
        date: today,
        dayNumber: lastDay ? lastDay.dayNumber + 1 : 1,
        failed: false,
        completed: false,
      });
    }

    return res.json({
      challenge,
      day,
    });
  } catch (err) {
    console.error("❌ Challenge fetch error:", err);
    return res.status(500).json({ message: "Failed to fetch challenge" });
  }
});

/**
 * POST /api/challenge
 * יצירה / החלפה של אתגר
 */
router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const { type, displayMode, goals, durationDays } = req.body;

    if (!type) {
      return res.status(400).json({ message: "Missing challenge type" });
    }

    // חישוב משך האתגר
    const resolvedDurationDays =
      type === "custom"
        ? Number(durationDays)
        : type === "14days"
        ? 14
        : type === "30days"
        ? 30
        : type === "75hard"
        ? 75
        : null;

    if (!resolvedDurationDays) {
      return res.status(400).json({ message: "Invalid challenge type" });
    }

    // מחיקת אתגר קודם + ימים שלו
    const existing = await Challenge.findOne({ user: userId });
    if (existing) {
      await ChallengeDay.deleteMany({
        challenge: existing._id,
        user: userId,
      });
      await existing.deleteOne();
    }

    // 📅 תאריך התחלה
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // יצירת אתגר
    const challenge = await Challenge.create({
      user: userId,
      type,
      durationDays: resolvedDurationDays,
      displayMode: displayMode || "daily",
      goals: goals || {},
      startDate: today,
    });

    // יצירת יום 1
    await ChallengeDay.create({
      challenge: challenge._id,
      user: userId,
      dayNumber: 1,
      date: today,
    });

    return res.status(201).json(challenge);
  } catch (err) {
    console.error("❌ Challenge creation error:", err);
    return res.status(500).json({ message: "Failed to start challenge" });
  }
});

/**
 * DELETE /api/challenge
 * איפוס מלא
 */
router.delete("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const challenge = await Challenge.findOne({ user: userId });
    if (!challenge) {
      return res.status(404).json({ message: "No active challenge" });
    }

    await ChallengeDay.deleteMany({
      challenge: challenge._id,
      user: userId,
    });

    await challenge.deleteOne();

    return res.json({ message: "Challenge reset successfully" });
  } catch (err) {
    console.error("❌ Challenge delete error:", err);
    return res.status(500).json({ message: "Failed to reset challenge" });
  }
});

module.exports = router;

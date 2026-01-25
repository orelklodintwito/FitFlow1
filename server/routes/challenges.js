const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Challenge = require("../models/Challenge");
const ChallengeDay = require("../models/ChallengeDay");

/**
 * GET /api/challenge
 * מחזיר את האתגר הפעיל למשתמש (או null)
 */
router.get("/", async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const challenge = await Challenge.findOne({ user: userId }).lean();
    return res.json(challenge || null);
  } catch (err) {
    console.error("❌ Challenge fetch error:", err);
    return res.status(500).json({ message: "Failed to fetch challenge" });
  }
});

/**
 * POST /api/challenge
 * יצירה/החלפה של אתגר
 * מחזיר challenge ישירות (לא עטוף)
 */
router.post("/", async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

const { type, displayMode, goals, durationDays } = req.body;

    if (!type) {
      return res.status(400).json({ message: "Missing challenge type" });
    }

    // מחיקת אתגר קודם + ימים
    const existing = await Challenge.findOne({ user: userId });
    if (existing) {
      await ChallengeDay.deleteMany({ challenge: existing._id });
      await existing.deleteOne();
    }

    // היום ב-00:00 כדי ש-/today יעבוד יפה
    const today = new Date();
    today.setHours(0, 0, 0, 0);

  const challenge = await Challenge.create({
  user: userId,
  type,
  durationDays:
    type === "custom"
      ? Number(durationDays)
      : type === "14days"
      ? 14
      : type === "30days"
      ? 30
      : 75,
  displayMode: displayMode || "daily",
  goals: goals || {},
  startDate: today,
});

    // יצירת יום 1
    await ChallengeDay.create({
      challenge: challenge._id,
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
 * איפוס מלא (אתגר + כל הימים)
 */
router.delete("/", async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const challenge = await Challenge.findOne({ user: userId });
    if (!challenge) {
      return res.status(404).json({ message: "No active challenge" });
    }

    await ChallengeDay.deleteMany({ challenge: challenge._id });
    await challenge.deleteOne();

    return res.json({ message: "Challenge reset successfully" });
  } catch (err) {
    console.error("❌ Challenge delete error:", err);
    return res.status(500).json({ message: "Failed to reset challenge" });
  }
});

module.exports = router;

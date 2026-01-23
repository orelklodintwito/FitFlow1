const express = require("express");
const router = express.Router();
const Challenge = require("../models/Challenge");

// אם יש לך middleware auth – השאירי
// const auth = require("../middleware/auth");

/**
 * GET /challenge
 * מחזיר את האתגר הפעיל של המשתמש
 */
router.get("/", async (req, res) => {
  try {
    const challenge = await Challenge.findOne({ user: req.user.id });
    res.json(challenge);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch challenge" });
  }
});

/**
 * POST /challenge
 * יצירה / עדכון אתגר
 */
router.post("/", async (req, res) => {
  try {
    const { type, displayMode, goals } = req.body;

    let challenge = await Challenge.findOne({ user: req.user.id });

    if (challenge) {
      // עדכון אתגר קיים
      challenge.type = type;
      challenge.displayMode = displayMode;
      challenge.goals = goals;
      challenge.startDate = new Date();

      await challenge.save();
      return res.json(challenge);
    }

    // יצירת אתגר חדש
    challenge = new Challenge({
      user: req.user.id,
      type,
      displayMode,
      goals,
      startDate: new Date(),
    });

    await challenge.save();
    res.status(201).json(challenge);
  } catch (err) {
    res.status(500).json({ message: "Failed to save challenge" });
  }
});

module.exports = router;

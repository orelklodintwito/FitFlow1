const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["custom", "75hard", "30days", "14days"],
      required: true,
    },

    displayMode: {
      type: String,
      enum: ["daily", "weekly"],
      default: "daily",
    },

    goals: {
      steps: Number,
      water: Number,      // ליטרים
      workouts: Number,   // לשבוע או ליום לפי displayMode
    },

    startDate: Date,
    endDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Challenge", challengeSchema);

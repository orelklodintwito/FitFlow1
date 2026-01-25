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

    // ✅ מספר ימי האתגר
    durationDays: {
      type: Number,
      required: true,
    },

    displayMode: {
      type: String,
      enum: ["daily", "weekly"],
      default: "daily",
    },

    goals: {
      steps: Number,
      water: Number,
      workouts: Number,
      reading: Number,
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    endDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Challenge", challengeSchema);

const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    challengeDay: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChallengeDay",
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    duration: {
      type: Number, // דקות
      required: true,
    },

    calories: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workout", workoutSchema);

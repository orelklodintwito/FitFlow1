const mongoose = require("mongoose");

const challengeDaySchema = new mongoose.Schema(
  {
    challenge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
      index: true,
    },

    dayNumber: {
      type: Number,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    // ===== DAILY INPUTS =====
    waterLiters: {
      type: Number,
      default: 0,
    },

    readingPages: {
      type: Number,
      default: 0,
    },
    steps: {
  type: Number,
  default: 0,
},


    workouts: [
      {
        type: {
          type: String, // Running, Strength, Yoga
          required: true,
        },
        duration: {
          type: Number, // minutes
          required: true,
        },
        calories: {
          type: Number,
          default: 0,
        },
      },
    ],

    // ===== STATUS =====
    nutritionCompleted: {
      type: Boolean,
      default: false,
    },

    workoutsCompleted: {
      type: Boolean,
      default: false,
    },
    waterCompleted: {
  type: Boolean,
  default: false,
},
stepsCompleted: {
  type: Boolean,
  default: false,
},

readingCompleted: {
  type: Boolean,
  default: false,
},

    completed: {
      type: Boolean,
      default: false,
    },

    failed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChallengeDay", challengeDaySchema);

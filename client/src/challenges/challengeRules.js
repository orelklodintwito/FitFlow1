// client/src/challenges/challengeRules.js

export const CHALLENGE_RULES = {
  "14days": {
    name: "14 Day Challenge",
    durationDays: 14,

    workouts: {
      perDay: 1,
      minMinutes: 45,
    },

    waterLiters: 2,
    readingPages: 10,

    nutrition: {
      calorieTolerance: 100,
      proteinRequired: true,
    },

    displayMode: "daily",
  },

  "30days": {
    name: "30 Day Challenge",
    durationDays: 30,

    workouts: {
      perDay: 2,
      minMinutes: 45,
    },

    waterLiters: 2,
    readingPages: 10,

    nutrition: {
      calorieTolerance: 100,
      proteinRequired: true,
    },

    displayMode: "weekly",
  },

  "75hard": {
    name: "75 Hard Challenge",
    durationDays: 75,

    workouts: {
      perDay: 2,
      minMinutes: 45,
    },

    waterLiters: 2,
    readingPages: 10,

    nutrition: {
      calorieTolerance: 100,
      proteinRequired: true,
    },

    displayMode: "weekly",
  },

  "custom": {
    name: "Custom Challenge",
    durationDays: null, // לא מוגבל

    useGoalsFromChallenge: true, // משתמש ב־challenge.goals
  },
};

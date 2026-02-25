// client/src/challenges/challengeRules.js

// central config for all challenge types
// each challenge defines its rules, duration, and daily requirements
// used across the app to validate progress and display correct UI

export const CHALLENGE_RULES = {
  "14days": {
    name: "14 Day Challenge",
    durationDays: 14,

    workouts: {
      perDay: 1,        // one workout per day (unlike 30/75 which need 2)
      minMinutes: 45,   // each workout must be at least 45 min
    },

    waterLiters: 2,     // daily water intake goal
    readingPages: 10,   // daily reading goal

    nutrition: {
      calorieTolerance: 100,   // allowed deviation from calorie target
      proteinRequired: true,   // must hit protein goal
    },

    displayMode: "daily",  // UI shows progress day by day
  },

  "30days": {
    name: "30 Day Challenge",
    durationDays: 30,

    workouts: {
      perDay: 2,        // two workouts per day
      minMinutes: 45,
    },

    waterLiters: 2,
    readingPages: 10,

    nutrition: {
      calorieTolerance: 100,
      proteinRequired: true,
    },

    displayMode: "weekly",  // UI groups progress by week
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

  // custom challenge - user defines their own goals
  // doesn't have fixed rules, pulls goals from the challenge object itself
  "custom": {
    name: "Custom Challenge",
    durationDays: null,          // no time limit

    useGoalsFromChallenge: true, // uses challenge.goals instead of hardcoded rules
  },
};
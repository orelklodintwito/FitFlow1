// server/challenges/challengeRules.js

module.exports = {
  "30days": {
    waterLiters: 2,
    readingPages: 10,
    workouts: {
      minMinutes: 30,
      perDay: 1,
    },
  },

  "75hard": {
    waterLiters: 3,
    readingPages: 20,
    workouts: {
      minMinutes: 45,
      perDay: 2,
    },
  },

  "14days": {
    waterLiters: 2,
    readingPages: 5,
    workouts: {
      minMinutes: 20,
      perDay: 1,
    },
  },
};

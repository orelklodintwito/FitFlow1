// server/challenges/challengeRules.js

module.exports = {
  30: {
    waterLiters: 2,
    readingPages: 10,
    workouts: {
      minMinutes: 30,
      perDay: 1,
    },
  },

  75: {
    waterLiters: 3,
    readingPages: 20,
    workouts: {
      minMinutes: 45,
      perDay: 2,
    },
  },
};

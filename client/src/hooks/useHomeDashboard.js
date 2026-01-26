import { useEffect, useState } from "react";
import { getTodayChallengeDay } from "../services/challengeDays";

export function useHomeDashboard(meals) {
  /* ============================== */
  /* DATE – START OF TODAY */
  /* ============================== */
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  /* ============================== */
  /* MEALS CALCULATIONS (TODAY ONLY) */
  /* ============================== */
  const allMeals = Object.values(meals || {})
    .flat()
    .filter((meal) => {
      if (!meal.date) return false;
      const mealDate = new Date(meal.date);
      mealDate.setHours(0, 0, 0, 0);
      return mealDate.getTime() === startOfToday.getTime();
    });

  const totalCalories = allMeals.reduce(
    (sum, meal) => sum + Number(meal.calories || 0),
    0
  );

  const totalProtein = allMeals.reduce(
    (sum, meal) => sum + Number(meal.protein || 0),
    0
  );

  const dailyGoal = 2000;

  const caloriesLeft = Math.max(dailyGoal - totalCalories, 0);

  const progressPercent = Math.min(
    100,
    Math.round((totalCalories / dailyGoal) * 100)
  );

  /* ============================== */
  /* CHALLENGE – SOURCE OF TRUTH */
  /* ============================== */
  const [hasChallenge, setHasChallenge] = useState(false);

  useEffect(() => {
    getTodayChallengeDay()
      .then((res) => {
        setHasChallenge(!!res.data);
      })
      .catch(() => setHasChallenge(false));
  }, []);

  const challengeTitle = hasChallenge
    ? "Active Challenge"
    : "Ready for your next challenge?";

  return {
    allMeals,
    totalCalories,
    totalProtein,
    caloriesLeft,
    progressPercent,
    challengeTitle,
  };
}

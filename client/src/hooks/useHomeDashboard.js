import { useEffect, useState } from "react";
import { getTodayChallengeDay } from "../services/challengeDays";
import { getChallenge } from "../services/challenge";
import { CHALLENGE_RULES } from "../challenges/challengeRules";

// hook for the home dashboard - calculates today's nutrition stats
// and checks if the user has an active challenge
export function useHomeDashboard(meals) {
  /* ============================== */
  /* DATE – START OF TODAY          */
  /* ============================== */
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  /* ============================== */
  /* MEALS CALCULATIONS (TODAY ONLY)*/
  /* ============================== */

  // flatten all meal categories and filter to only today's meals
  const allMeals = Object.values(meals || {})
    .flat()
    .filter((meal) => {
      if (!meal.date) return false;
      const mealDate = new Date(meal.date);
      mealDate.setHours(0, 0, 0, 0);
      return mealDate.getTime() === startOfToday.getTime();
    });

  // sum up calories and protein from today's meals
  const totalCalories = allMeals.reduce(
    (sum, meal) => sum + Number(meal.calories || 0),
    0
  );

  const totalProtein = allMeals.reduce(
    (sum, meal) => sum + Number(meal.protein || 0),
    0
  );

  /* ============================== */
  /* CHALLENGE STATUS + CALORIE GOAL*/
  /* ============================== */
  const [hasChallenge, setHasChallenge] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(2000); // default fallback

  // check if the user has an active challenge, and pull the calorie goal from it
  useEffect(() => {
    const loadChallenge = async () => {
      try {
        const res = await getChallenge();

        if (res.data?.challenge) {
          setHasChallenge(true);

          // get calorie goal from challenge rules, same source as useChallengePage
          const rules = CHALLENGE_RULES[res.data.challenge.type] || null;
          if (rules?.calories) {
            setDailyGoal(rules.calories);
          }
        } else {
          setHasChallenge(false);
        }
      } catch {
        setHasChallenge(false);
      }
    };

    loadChallenge();
  }, []);

  // how many calories left to hit the goal (never goes below 0)
  const caloriesLeft = Math.max(dailyGoal - totalCalories, 0);

  // progress bar percentage, capped at 100
  const progressPercent = Math.min(
    100,
    Math.round((totalCalories / dailyGoal) * 100)
  );

  const challengeTitle = hasChallenge
    ? "Active Challenge"
    : "Ready for your next challenge?";

  return {
    allMeals,
    totalCalories,
    totalProtein,
    dailyGoal,
    caloriesLeft,
    progressPercent,
    challengeTitle,
  };
}
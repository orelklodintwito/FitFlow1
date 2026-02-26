import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getWorkouts, deleteWorkout } from "../services/workouts";
import {
  getChallenge,
  saveChallenge,
  deleteChallenge,
} from "../services/challenge";
import {
  getTodayChallengeDay,
  saveChallengeDay,
  getChallengeDayByNumber,
  resetChallengeDays,
} from "../services/challengeDays";

import { CHALLENGE_RULES } from "../challenges/challengeRules";

// main hook for the challenge page - handles all challenge logic, state, and API calls
// this is a big hook because the challenge page has a lot going on:
// selecting a challenge, custom challenge setup, daily progress tracking, viewing past days
export function useChallengePage(meals) {
  // step controls which screen to show: "select" | "custom" | "active"
  const [step, setStep] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // custom challenge form fields
  const [durationDays, setDurationDays] = useState("");
  const [workoutsGoal, setWorkoutsGoal] = useState("");

  // the active challenge object from the server
  const [challenge, setChallenge] = useState(null);
  const [today, setToday] = useState(null);           // the actual current day data
  const [selectedDay, setSelectedDay] = useState(null); // which day number is selected in UI
  const [viewedDay, setViewedDay] = useState(null);     // day data when viewing a past day
  const [viewingPastDay, setViewingPastDay] = useState(false);

  // custom challenge goal fields
  const [steps, setSteps] = useState("");
  const [water, setWater] = useState("");
  const [reading, setReading] = useState("");
  const [workouts, setWorkouts] = useState([]);
  const [editingWorkout, setEditingWorkout] = useState(null);

  const [customError, setCustomError] = useState("");

  // daily progress inputs (water, reading, steps for the current/viewed day)
  const [dayWater, setDayWater] = useState("");
  const [dayReading, setDayReading] = useState("");
  const [daySteps, setDaySteps] = useState("");

  // ui state
  const [savingDay, setSavingDay] = useState(false);
  const [dayError, setDayError] = useState("");
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);

  // get the rules for the current challenge type (e.g. "75hard" -> rules object)
  const rules = useMemo(() => {
    if (!challenge) return null;
    return CHALLENGE_RULES[challenge.type] || null;
  }, [challenge]);

  // custom challenges store duration on the challenge itself, presets use rules
  const totalDays =
    challenge?.type === "custom"
      ? challenge?.durationDays
      : rules?.durationDays;

  /* ================= HELPERS ================= */

  // fetch workouts for a specific challenge day
  const loadWorkouts = async (challengeDayId) => {
    try {
      const res = await getWorkouts(challengeDayId);
      setWorkouts(res.data || []);
    } catch (err) {
      console.error("Failed to load workouts", err);
    }
  };

  // refresh today's challenge day data from the server
  // skipped when viewing a past day so it doesn't overwrite the viewed data
  const refreshToday = async () => {
    if (viewingPastDay) return;
    try {
      const res = await getTodayChallengeDay();
      setToday(res.data || null);

      if (res.data?.dayNumber) {
        setSelectedDay(res.data.dayNumber);
      }

      // populate the daily input fields with existing data
      if (res.data) {
        setDayWater(
          res.data.waterLiters != null ? String(res.data.waterLiters) : ""
        );
        setDayReading(
          res.data.readingPages != null ? String(res.data.readingPages) : ""
        );
        setDaySteps(res.data.steps != null ? String(res.data.steps) : "");
      } else {
        setDayWater("");
        setDayReading("");
        setDaySteps("");
      }

      await loadWorkouts(res.data?._id);
    } catch {
      setToday(null);
    }
  };

  /* ================= INITIAL LOAD ================= */
  // on mount - check if user has an active challenge
  // if yes -> show "active" screen, if no -> show "select" screen
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getChallenge();

        if (res.data?.challenge) {
          setChallenge(res.data.challenge);

          // if the server also returned today's day data, use it
          if (res.data.day) {
            setToday(res.data.day);
            setSelectedDay(res.data.day.dayNumber);

            setDayWater(
              res.data.day.waterLiters != null
                ? String(res.data.day.waterLiters)
                : ""
            );
            setDayReading(
              res.data.day.readingPages != null
                ? String(res.data.day.readingPages)
                : ""
            );
            setDaySteps(
              res.data.day.steps != null
                ? String(res.data.day.steps)
                : ""
            );
          }

          setStep("active");
        } else {
          setStep("select");
        }
      } catch (err) {
        console.error("Failed to load challenge", err);
        setStep("select");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  /* ================= START PRESET CHALLENGE ================= */
  const startPresetChallenge = async (type) => {
    try {
      setLoading(true);
      const res = await saveChallenge({
        type,
        displayMode: "daily",
        goals: {},
      });
      setChallenge(res.data);
      setStep("active");
      await refreshToday();
    } catch {
      alert("Failed to start challenge");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SAVE CUSTOM CHALLENGE ================= */
  const handleCustomSave = async (e) => {
    e.preventDefault();
    setCustomError("");

    try {
      setLoading(true);

      const res = await saveChallenge({
        type: "custom",
        durationDays: Number(durationDays),
        goals: {
          steps: steps ? Number(steps) : undefined,
          water: water ? Number(water) : undefined,
          reading: reading ? Number(reading) : undefined,
          workouts: workoutsGoal ? Number(workoutsGoal) : undefined,
        },
      });

      setChallenge(res.data);
      setStep("active");
      await refreshToday();
    } catch {
      setCustomError("Failed to save challenge");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DAILY ACTIONS ================= */

  const handleDeleteWorkout = async (id) => {
    const confirmed = window.confirm("Delete this workout?");
    if (!confirmed) return;

    try {
      await deleteWorkout(id);
      // reload workouts for whichever day is currently displayed
      await loadWorkouts(viewedDay?._id || today?._id);
    } catch {
      alert("Failed to delete workout");
    }
  };

  // silently saves day data without UI feedback (used for auto-save on input change)
  const autoSaveDay = async (payload) => {
    try {
      await saveChallengeDay(payload);
    } catch (err) {
      console.error("Auto save failed", err);
    }
  };

  // explicit save with loading state and error handling
  const handleSaveDay = async () => {
    setDayError("");
    setSavingDay(true);

    try {
      await saveChallengeDay({
        waterLiters: dayWater === "" ? undefined : Number(dayWater),
        readingPages: dayReading === "" ? undefined : Number(dayReading),
        steps: daySteps === "" ? undefined : Number(daySteps),
      });
      setViewingPastDay(false);
      // refresh to get updated completion status and potentially move to next day
      await refreshToday();
    } catch {
      setDayError("Failed to save daily progress");
    } finally {
      setSavingDay(false);
    }
  };

  // load a specific day's data when the user clicks on a day in the timeline
  const handleSelectDay = async (dayNumber) => {
    try {
      const res = await getChallengeDayByNumber(dayNumber);

      setSelectedDay(dayNumber);
      setViewedDay(res.data);
      setViewingPastDay(dayNumber !== today?.dayNumber);
      await loadWorkouts(res.data?._id);

      // populate inputs with the selected day's data
      setDayWater(res.data?.waterLiters != null ? String(res.data.waterLiters) : "");
      setDayReading(res.data?.readingPages != null ? String(res.data.readingPages) : "");
      setDaySteps(res.data?.steps != null ? String(res.data.steps) : "");
    } catch {
      alert("Failed to load selected day");
    }
  };

  /* ================= DERIVED STATE ================= */

  // readonly when viewing a past day (not today)
  const isReadonly = selectedDay !== null && selectedDay !== today?.dayNumber;

  // the day object that's actually displayed on screen
  const dayToShow = isReadonly ? viewedDay : today;

  // filter meals to only show ones from the displayed day's date
  let allMeals = [];

  if (dayToShow?.date && meals) {
    const dayStart = new Date(dayToShow.date);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    allMeals = Object.values(meals)
      .flat()
      .filter((m) => {
        const mealDate = new Date(m.date);
        return mealDate >= dayStart && mealDate < dayEnd;
      });
  }

  const totalCalories = allMeals.reduce(
    (sum, m) => sum + Number(m.calories || 0),
    0
  );

  const calorieGoal = rules?.calories || 2000;

  // within ±100 of goal counts as completed
  const nutritionCompleted =
    Math.abs(totalCalories - calorieGoal) <= 100;

  // build a list of all tasks and their completion status
  // "enabled" = this task applies to the current challenge type
  const taskStatus = [
    { enabled: true, done: nutritionCompleted },
    {
      enabled: typeof rules?.waterLiters === "number",
      done: dayToShow?.waterCompleted,
    },
    {
      enabled: typeof rules?.readingPages === "number",
      done: dayToShow?.readingCompleted,
    },
    {
      enabled: typeof rules?.steps === "number",
      done: dayToShow?.stepsCompleted,
    },
    {
      enabled: !!rules?.workouts,
      done: dayToShow?.workoutsCompleted,
    },
  ];

  const enabledTasks = taskStatus.filter((t) => t.enabled);
  const completedTasks = enabledTasks.filter((t) => t.done).length;
  const totalTasks = enabledTasks.length;

  // NOTE: if totalTasks is 0 this will be NaN (0/0). shouldn't happen in practice
  // since nutrition is always enabled, but just in case:
  const progressPercent = totalTasks > 0
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  /* ================= CHANGE / RESTART ================= */

  // delete the challenge entirely and go back to selection screen
  const handleChangeChallenge = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to change the challenge?\nAll progress will be deleted."
    );
    if (!confirmed) return;

    try {
      await deleteChallenge();

      // clear all local state
      setChallenge(null);
      setToday(null);
      setSelectedDay(null);
      setViewedDay(null);

      setStep("select");
    } catch (err) {
      console.error("Failed to delete challenge", err);
      alert("Failed to change challenge");
    }
  };

  // keep the same challenge but reset all daily progress back to day 1
  const handleRestartChallenge = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to restart the challenge?\nAll progress will be reset."
    );
    if (!confirmed) return;

    try {
      setLoading(true);

      // delete all challenge days on the server
      await resetChallengeDays();

      // refresh - server will create a new Day 1
      await refreshToday();

      // reset viewing state
      setSelectedDay(1);
      setViewedDay(null);
      setViewingPastDay(false);

      setStep("active");
    } catch (err) {
      console.error("Failed to restart challenge", err);
      alert("Failed to restart challenge");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RETURN ================= */
  return {
    // state
    step,
    loading,
    challenge,
    rules,
    today,
    totalDays,
    selectedDay,
    workouts,
    editingWorkout,
    showWorkoutModal,
    viewedDay,
    dayToShow,

    // inputs
    durationDays,
    setDurationDays,
    workoutsGoal,
    setWorkoutsGoal,
    steps,
    setSteps,
    water,
    setWater,
    reading,
    setReading,
    dayWater,
    setDayWater,
    dayReading,
    setDayReading,
    daySteps,
    setDaySteps,

    // ui / derived
    savingDay,
    dayError,
    customError,
    isReadonly,
    progressPercent,
    completedTasks,
    totalTasks,
    totalCalories,
    calorieGoal,
    allMeals,

    // actions
    setStep,
    setEditingWorkout,
    setShowWorkoutModal,
    navigate,
    startPresetChallenge,
    handleCustomSave,
    handleSaveDay,
    handleSelectDay,
    handleDeleteWorkout,
    autoSaveDay,
    handleChangeChallenge,
    handleRestartChallenge,
    refreshToday,
    loadWorkouts,
  };
}
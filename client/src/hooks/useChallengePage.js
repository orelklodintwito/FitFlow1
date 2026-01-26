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

export function useChallengePage(meals) {
  // select | custom | active
  const [step, setStep] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [durationDays, setDurationDays] = useState("");
  const [workoutsGoal, setWorkoutsGoal] = useState("");

  const [challenge, setChallenge] = useState(null);
  const [today, setToday] = useState(null);        // היום האמיתי
  const [selectedDay, setSelectedDay] = useState(null);
  const [viewedDay, setViewedDay] = useState(null); // 👈 יום לצפייה
  const [viewingPastDay, setViewingPastDay] = useState(false);

  // custom challenge fields
  const [steps, setSteps] = useState("");
  const [water, setWater] = useState("");
  const [reading, setReading] = useState("");
  const [workouts, setWorkouts] = useState([]);
  const [editingWorkout, setEditingWorkout] = useState(null);

  const [customError, setCustomError] = useState("");

  // daily inputs
  const [dayWater, setDayWater] = useState("");
  const [dayReading, setDayReading] = useState("");
  const [daySteps, setDaySteps] = useState("");

  // ui
  const [savingDay, setSavingDay] = useState(false);
  const [dayError, setDayError] = useState("");
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);

  const rules = useMemo(() => {
    if (!challenge) return null;
    return CHALLENGE_RULES[challenge.type] || null;
  }, [challenge]);

  const totalDays =
    challenge?.type === "custom"
      ? challenge?.durationDays
      : rules?.durationDays;

  /* ================= HELPERS ================= */
  const loadWorkouts = async () => {
    try {
      const res = await getWorkouts();
      setWorkouts(res.data || []);
    } catch (err) {
      console.error("Failed to load workouts", err);
    }
  };

  const refreshToday = async () => {
    if (viewingPastDay) return;
    try {
      const res = await getTodayChallengeDay();
      setToday(res.data || null);

      if (res.data?.dayNumber) {
        setSelectedDay(res.data.dayNumber);
      }

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

      await loadWorkouts();
    } catch {
      setToday(null);
    }
  };

  /* ================= LOAD ================= */
   useEffect(() => {
    const load = async () => {
      try {
        const res = await getChallenge();

        if (res.data?.challenge) {
          setChallenge(res.data.challenge);

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

  /* ================= PRESET ================= */
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

  /* ================= CUSTOM ================= */
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

  /* ================= DAY ================= */
  const handleDeleteWorkout = async (id) => {
    const confirmed = window.confirm("Delete this workout?");
    if (!confirmed) return;

    try {
      await deleteWorkout(id);
      loadWorkouts();
    } catch {
      alert("Failed to delete workout");
    }
  };

  const autoSaveDay = async (payload) => {
    try {
      await saveChallengeDay(payload);
    } catch (err) {
      console.error("Auto save failed", err);
    }
  };

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
      // ✅ חשוב: ריענון היום כדי לעבור ליום הבא בלי ריפרש
      await refreshToday();
    } catch {
      setDayError("Failed to save daily progress");
    } finally {
      setSavingDay(false);
    }
  };

 const handleSelectDay = async (dayNumber) => {
  try {
    const res = await getChallengeDayByNumber(dayNumber);

    setSelectedDay(dayNumber);
    setViewedDay(res.data); // 👈 שומרת יום לצפייה בלבד

    setDayWater(res.data?.waterLiters != null ? String(res.data.waterLiters) : "");
    setDayReading(res.data?.readingPages != null ? String(res.data.readingPages) : "");
    setDaySteps(res.data?.steps != null ? String(res.data.steps) : "");
  } catch {
    alert("Failed to load selected day");
  }
};


  /* ================= DERIVED ================= */
const isReadonly = selectedDay !== null && selectedDay !== today?.dayNumber;

// ⭐ זה היום שמוצג בפועל במסך
const dayToShow = isReadonly ? viewedDay : today;

// ✅ חישוב תזונה לפי תאריך ה־ChallengeDay (ולא לפי היום עכשיו)
let allMeals = [];


    if (dayToShow?.date && meals) {
    const start = new Date(dayToShow.date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    allMeals = Object.values(meals)
      .flat()
      .filter((m) => {
        const d = new Date(m.date);
        return d >= start && d < end;
      });
  }

  const totalCalories = allMeals.reduce(
    (sum, m) => sum + Number(m.calories || 0),
    0
  );

  const calorieGoal = rules?.calories || 2000;

  const nutritionCompleted =
  Math.abs(totalCalories - calorieGoal) <= 100;

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

  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

 const handleChangeChallenge = async () => {
  const confirmed = window.confirm(
    "Are you sure you want to change the challenge?\nAll progress will be deleted."
  );
  if (!confirmed) return;

  try {
    await deleteChallenge();      // ⬅️ מוחק את האתגר מהשרת

    // ניקוי state מקומי
    setChallenge(null);
    setToday(null);
    setSelectedDay(null);
    setViewedDay(null);

    setStep("select");            // מעבר למסך הבחירה
  } catch (err) {
    console.error("Failed to delete challenge", err);
    alert("Failed to change challenge");
  }
};


  const handleRestartChallenge = async () => {
  const confirmed = window.confirm(
    "Are you sure you want to restart the challenge?\nAll progress will be reset."
  );
  if (!confirmed) return;

  try {
    setLoading(true);

    // מוחקים רק ימים
    await resetChallengeDays();

    // ריענון היום – יווצר Day 1 חדש מהשרת
    await refreshToday();

    // ניקוי state של צפייה
    setSelectedDay(1);
    setViewedDay(null);
    setViewingPastDay(false);

    // נשארים במסך active
    setStep("active");
  } catch (err) {
    console.error("Failed to restart challenge", err);
    alert("Failed to restart challenge");
  } finally {
    setLoading(false);
  }
};




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

    // ui
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

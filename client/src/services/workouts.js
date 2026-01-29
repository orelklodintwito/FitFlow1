// src/services/workouts.js
import api from "./api";

// הוספת אימון
export const addWorkout = (data) => {
  return api.post("/workouts", data);
};

// שליפת אימונים (ליום הנוכחי)
export const getWorkouts = (challengeDayId) => {
  if (challengeDayId) {
    return api.get(`/workouts?challengeDayId=${challengeDayId}`);
  }

  // fallback – היום האמיתי
  return api.get("/workouts");
};


// מחיקת אימון
export const deleteWorkout = (id) => {
  return api.delete(`/workouts/${id}`);
};

// עריכת אימון (אופציונלי לשלב זה)
export const updateWorkout = (id, data) => {
  return api.put(`/workouts/${id}`, data);
};

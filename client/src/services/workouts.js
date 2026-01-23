// src/services/workouts.js
import api from "./api";

export const addWorkout = (data) => {
  return api.post("/workouts", data);
};

export const getWorkouts = () => {
  return api.get("/workouts");
};

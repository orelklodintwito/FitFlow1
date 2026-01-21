import api from "./api";

export const getMeals = () => api.get("/meals");

export const addMeal = (meal) => api.post("/meals", meal);

export const deleteMeal = (id) => api.delete(`/meals/${id}`);

export const updateMeal = (id, data) =>
  api.put(`/meals/${id}`, data);

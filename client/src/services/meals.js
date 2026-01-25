import api from "./api";

// GET /api/meals
export const getMeals = () => api.get("/meals");

// POST /api/meals
export const addMeal = (meal) => api.post("/meals", meal);

// DELETE /api/meals/:id
export const deleteMeal = (id) => api.delete(`/meals/${id}`);

// PUT /api/meals/:id
export const updateMeal = (id, data) =>
  api.put(`/meals/${id}`, data);

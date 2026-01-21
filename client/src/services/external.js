import api from "./api";

export const searchMealsExternal = (query) =>
  api.get(`/external/meals?search=${query}`);

import api from "./api";

export const login = (email, password) => {
  return api.post("/auth/login", { email, password });
};

export const signup = (email, password, name) => {
  return api.post("/auth/signup", { email, password, name });
};

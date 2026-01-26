import api from "./api";

export const login = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

export const signup = async (data) => {
  const res = await api.post("/auth/signup", data);
  return res.data;
};

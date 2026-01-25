import api from "./api";

export const login = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};


export const signup = (email, password, name) => {
  return api.post("/auth/signup", { email, password, name });
};

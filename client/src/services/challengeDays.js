import api from "./api";

export const getTodayChallengeDay = () => {
  return api.get("/challenge-day/today");
};

export const saveChallengeDay = (data) => {
  return api.post("/challenge-day", data);
};

export const getAllChallengeDays = () => {
  return api.get("/challenge-day");
};

export const getChallengeDayByNumber = (dayNumber) => {
  return api.get(`/challenge-day/${dayNumber}`);
};
export const getTodayChallenge = async () => {
  const res = await api.get("/challenge-day/today");
  return res.data
    ? { day: res.data, challengeId: res.data.challenge }
    : null;
};

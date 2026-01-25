import api from "./api";

// שליפת אתגר פעיל
export const getChallenge = () => {
  return api.get("/challenge");
};

// יצירת / שמירת אתגר חדש
export const saveChallenge = (data) => {
  return api.post("/challenge", data);
};

// איפוס / שינוי אתגר
export const deleteChallenge = () => {
  return api.delete("/challenge");
};

// (אופציונלי) עדכון הגדרות אתגר
export const updateChallengeSettings = (data) => {
  return api.put("/challenge/settings", data);
};

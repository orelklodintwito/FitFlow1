import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark",        // 🌙 light / dark
  fontSize: "medium"   // small / medium / large
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleMode(state) {
      state.mode = state.mode === "dark" ? "light" : "dark";
    },
    setFontSize(state, action) {
      state.fontSize = action.payload;
    },
    resetTheme() {
      return initialState;
    }
  }
});

export const { toggleMode, setFontSize, resetTheme } = themeSlice.actions;
export default themeSlice.reducer;

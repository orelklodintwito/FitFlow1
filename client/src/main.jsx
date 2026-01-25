import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import { store } from "./redux/store";
import { FavoritesProvider } from "./context/FavoritesContext.jsx";

/* ✅ THEME → GLOBAL BODY CLASS */
const applyThemeToBody = () => {
  const mode = store.getState().theme.mode;
  document.body.classList.remove("dark", "light");
  document.body.classList.add(mode);
};

// הפעלה ראשונית
applyThemeToBody();

// האזנה לשינויים ב־Redux
store.subscribe(applyThemeToBody);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <FavoritesProvider>
          <App />
        </FavoritesProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

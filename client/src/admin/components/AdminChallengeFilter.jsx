import { useState, useRef, useEffect } from "react";

// Dropdown component for filtering users by challenge type in the admin panel
function AdminChallengeFilter({ value, onChange }) {
  const [open, setOpen] = useState(false); // controls whether the dropdown menu is visible
  const ref = useRef(null); // ref to the wrapper div, used to detect outside clicks

  // close the dropdown when clicking anywhere outside of it
  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close); // cleanup on unmount
  }, []);

  // the challenge values we support - anything else is considered "Custom"
  const known = ["75 Hard", "30 Day", "none"];

  // determine the button label based on current filter value
  // if nothing is selected we show a generic "Challenge" text
  const label =
    value === "75 Hard"
      ? "75 Hard"
      : value === "30 Day"
      ? "30 Day"
      : value === "none"
      ? "No Challenge"
      : value
      ? "Custom"
      : "Challenge";

  return (
    <div className="admin-filter-dropdown" ref={ref}>
      {/* main trigger button - toggles the menu open/closed */}
      <button
        className="admin-pill admin-filter-trigger"
        onClick={() => setOpen(!open)}
      >
        {label}
        <span className="caret">▾</span>
      </button>

      {/* dropdown menu - only rendered when open is true */}
      {open && (
        <div className="admin-filter-menu">
          {/* each button acts as a toggle - clicking the active one again clears the filter */}
          <button
            className={value === "75 Hard" ? "active" : ""}
            onClick={() => {
              onChange(value === "75 Hard" ? "" : "75 Hard");
              setOpen(false);
            }}
          >
            75 Hard
          </button>

          <button
            className={value === "30 Day" ? "active" : ""}
            onClick={() => {
              onChange(value === "30 Day" ? "" : "30 Day");
              setOpen(false);
            }}
          >
            30 Day
          </button>

          <button
            className={value === "none" ? "active" : ""}
            onClick={() => {
              onChange(value === "none" ? "" : "none");
              setOpen(false);
            }}
          >
            No Challenge
          </button>

          {/* if the current value isn't one of the known ones, show it as Custom.
              this is display-only, no onClick since you can't select custom from here */}
          {value && !known.includes(value) && (
            <button className="active">Custom</button>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminChallengeFilter;
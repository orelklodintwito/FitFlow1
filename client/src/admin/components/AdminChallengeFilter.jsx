import { useState, useRef, useEffect } from "react";

function AdminChallengeFilter({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const known = ["75 Hard", "30 Day", "none"];

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
      <button
        className="admin-pill admin-filter-trigger"
        onClick={() => setOpen(!open)}
      >
        {label}
        <span className="caret">▾</span>
      </button>

      {open && (
        <div className="admin-filter-menu">
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

          {/* Custom – רק תצוגה */}
          {value && !known.includes(value) && (
            <button className="active">Custom</button>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminChallengeFilter;

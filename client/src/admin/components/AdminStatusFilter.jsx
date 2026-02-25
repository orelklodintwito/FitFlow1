import { useState, useRef, useEffect } from "react";

// dropdown filter for filtering users by status (active / suspended)
// same pattern as the other filter components but this one uses .map()
// which is cleaner than repeating buttons manually - nice improvement here
function AdminStatusFilter({ value, onChange }) {
  const [open, setOpen] = useState(false); // controls dropdown visibility
  const ref = useRef(null); // ref for outside click detection

  // close dropdown when clicking outside
  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close); // cleanup
  }, []);

  // dynamic label based on current selection, defaults to "Status"
  // NOTE: there's a blank line between "Suspended" and the default case -
  // not a bug but looks a bit weird, just formatting
  const label =
    value === "active"
      ? "Active"
      : value === "suspended"
      ? "Suspended"
      : "Status";

  const statuses = ["active", "suspended"];

  return (
    <div className="admin-filter-dropdown" ref={ref}>
      {/* trigger button - shows the selected status or "Status" by default */}
      <button
        className="admin-pill admin-filter-trigger"
        onClick={() => setOpen(!open)}
      >
        {label}
        <span className="caret">▾</span>
      </button>

      {open && (
        <div className="admin-filter-menu">
          {/* mapping over statuses array instead of writing each button manually,
              toggle logic included - clicking the active one clears the filter */}
          {statuses.map((s) => (
            <button
              key={s}
              className={value === s ? "active" : ""}
              onClick={() => {
                onChange(value === s ? "" : s);
                setOpen(false);
              }}
            >
              {/* capitalize first letter for display */}
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminStatusFilter;
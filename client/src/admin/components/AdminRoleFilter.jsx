import { useState, useRef, useEffect } from "react";

// dropdown filter for filtering users by role (admin / user) in the admin panel
// very similar structure to AdminChallengeFilter
function AdminRoleFilter({ value, onChange }) {
  const [open, setOpen] = useState(false); // whether the dropdown is open
  const ref = useRef(null); // ref for detecting clicks outside

  // close dropdown on outside click
  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close); // cleanup listener
  }, []);

  // dynamic label so the user can see which filter is active
  const label = value === "admin" ? "Admin" : value === "user" ? "User" : "Roles";

  return (
    <div className="admin-filter-dropdown" ref={ref}>
      {/* trigger button - now shows the selected role instead of always "Roles" */}
      <button
        className="admin-pill admin-filter-trigger"
        onClick={() => setOpen(!open)}
      >
        {label}
        <span className="caret">▾</span>
      </button>

      {open && (
        <div className="admin-filter-menu">
          {/* added toggle - clicking the active option again clears the filter,
              same pattern as ChallengeFilter */}
          <button
            className={value === "admin" ? "active" : ""}
            onClick={() => {
              onChange(value === "admin" ? "" : "admin");
              setOpen(false);
            }}
          >
            Admin
          </button>

          <button
            className={value === "user" ? "active" : ""}
            onClick={() => {
              onChange(value === "user" ? "" : "user");
              setOpen(false);
            }}
          >
            User
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminRoleFilter;
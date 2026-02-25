import { useState, useRef, useEffect } from "react";

function AdminRoleFilter({ value, onChange }) {
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

  return (
    <div className="admin-filter-dropdown" ref={ref}>
      <button
        className="admin-pill admin-filter-trigger"
        onClick={() => setOpen(!open)}
      >
        Roles
        <span className="caret">▾</span>
      </button>

      {open && (
        <div className="admin-filter-menu">
          <button
            className={value === "admin" ? "active" : ""}
            onClick={() => {
              onChange("admin");
              setOpen(false);
            }}
          >
            Admin
          </button>

          <button
            className={value === "user" ? "active" : ""}
            onClick={() => {
              onChange("user");
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

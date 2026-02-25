import { useState, useRef, useEffect } from "react";

function AdminStatusFilter({ value, onChange }) {
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

  const label =
    value === "active"
      ? "Active"
      : value === "suspended"
      ? "Suspended"
      : value === "deleted"
      ? "Deleted"
      : "Status";

  const statuses = ["active", "suspended", "deleted"];

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
          {statuses.map((s) => (
            <button
              key={s}
              className={value === s ? "active" : ""}
              onClick={() => {
                onChange(value === s ? "" : s);
                setOpen(false);
              }}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminStatusFilter;
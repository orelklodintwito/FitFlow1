// src/admin/components/AdminKpiRow.jsx
import "../admin.css";

// displays the top KPI cards in the admin dashboard (total users, admins, etc.)
// receives an array of { label, value } objects from the parent
function AdminKpiRow({ kpis }) {
  // helper to pull a value from the kpis array by label
  // returns 0 if the label isn't found or kpis is undefined
  const get = (label) =>
    kpis?.find((k) => k.label === label)?.value ?? 0;

  return (
    <section className="admin-section">
      <div className="admin-grid-4">
        <div className="admin-kpi-card dark">
          <h4>Total Users</h4>
          <p className="admin-kpi-number">{get("Total Users")}</p>
        </div>

        <div className="admin-kpi-card success">
          <h4>Admins</h4>
          <p className="admin-kpi-number">{get("Admins")}</p>
        </div>

        {/* NOTE: the indentation here is a bit off compared to the cards above,
            not a bug but worth keeping consistent for readability */}
        <div className="admin-kpi-card danger">
          <h4>Users Deleted Today</h4>
          <p className="admin-kpi-number">
            {get("Users Deleted Today")}
          </p>
        </div>

        <div className="admin-kpi-card warning">
          <h4>Users Suspended Today</h4>
          <p className="admin-kpi-number">
            {get("Users Suspended Today")}
          </p>
        </div>
      </div>
    </section>
  );
}

export default AdminKpiRow;
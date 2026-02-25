// src/admin/components/AdminRecentActivity.jsx
import "../admin.css";

// shows a list of recent admin actions (like user deletions, suspensions, etc.)
// receives an array of activity objects from the parent
function AdminRecentActivity({ items }) {
  return (
    <section className="admin-section compact">
      <h2 className="admin-section-title">Recent Activity</h2>

      <div className="admin-activity-list">
        {/* if there's no activity yet, show a fallback message */}
        {items.length === 0 ? (
          <p className="admin-empty">No recent activity</p>
        ) : (
          // using _id as key if available, otherwise falling back to index
          // (index isn't ideal as a key but works here since the list is static)
          items.map((item, index) => (
            <div
              key={item._id || index}
              className="admin-activity-item"
            >
              <div className="admin-activity-left">
                <strong>{item.description}</strong>
                <span className="admin-activity-action">
                  {item.title}
                </span>
              </div>

              {/* showing just the date part (YYYY-MM-DD) from the ISO string */}
              <span className="admin-activity-time">
                {item.date?.slice(0, 10)}
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default AdminRecentActivity;
// src/admin/components/AdminRecentActivity.jsx
import "../admin.css";

function AdminRecentActivity({ items }) {
  return (
    <section className="admin-section compact">
      <h2 className="admin-section-title">Recent Activity</h2>

      <div className="admin-activity-list">
        {items.length === 0 ? (
          <p className="admin-empty">No recent activity</p>
        ) : (
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
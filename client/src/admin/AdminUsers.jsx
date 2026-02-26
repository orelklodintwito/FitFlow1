import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../admin/admin.css";

import AdminRoleFilter from "./components/AdminRoleFilter";
import AdminStatusFilter from "./components/AdminStatusFilter";
// removed unused AdminChallengeFilter import

// admin users page - shows a table of all users with filters and actions
function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // filter state - each field narrows down the displayed users
  const [filters, setFilters] = useState({
    email: "",
    role: "",
    status: "",
    challenge: "",
  });

  /* ===================== FETCH USERS ===================== */
  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      const status = err?.response?.status;

      // unauthorized - clear auth and redirect
      if (status === 401 || status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("userProfile");
        navigate("/", { replace: true });
      } else {
        console.error("Failed to load admin users:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ===================== ACTIONS ===================== */

  // added try/catch to all actions so user sees an error if something fails

  const suspendUser = async (id) => {
    const confirmAction = window.confirm(
      "Are you sure you want to suspend this user?"
    );
    if (!confirmAction) return;

    try {
      await api.patch(`/admin/users/${id}/suspend`);
      fetchUsers();
    } catch (err) {
      console.error("Failed to suspend user:", err);
      alert("Failed to suspend user");
    }
  };

  const activateUser = async (id) => {
    const confirmAction = window.confirm(
      "Are you sure you want to activate this user?"
    );
    if (!confirmAction) return;

    try {
      await api.patch(`/admin/users/${id}/activate`);
      fetchUsers();
    } catch (err) {
      console.error("Failed to activate user:", err);
      alert("Failed to activate user");
    }
  };

  const deleteUser = async (id) => {
    const confirmAction = window.confirm(
      "Are you sure you want to permanently delete this user?"
    );
    if (!confirmAction) return;

    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Failed to delete user");
    }
  };

  /* ===================== FILTERS ===================== */
  const filteredUsers = users.filter((u) => {
    const matchEmail = u.email
      ?.toLowerCase()
      .includes(filters.email.toLowerCase());

    const matchRole = !filters.role || u.role === filters.role;

    // deleted users have a deletedAt field, others checked by status
    const matchStatus =
      !filters.status ||
      (filters.status === "deleted" && u.deletedAt) ||
      (filters.status !== "deleted" && u.status === filters.status);

    // "none" means users with no active challenge
    const matchChallenge =
      !filters.challenge ||
      (filters.challenge === "none" && !u.activeChallenge) ||
      u.activeChallenge === filters.challenge;

    return matchEmail && matchRole && matchStatus && matchChallenge;
  });

  if (loading) {
    return (
      <div className="page-wrapper dark">
        <div className="admin-empty">Loading users…</div>
      </div>
    );
  }

  return (
    <div className="page-wrapper dark">
      <div className="page-content">
        <h1 className="admin-title">Admin Users</h1>

        {/* FILTERS */}
        <div className="admin-filters-bar">
          {/* email search input */}
          <div className="admin-filter-dropdown">
            <div className="admin-pill admin-email-pill">
              <input
                type="text"
                placeholder="Search email"
                value={filters.email}
                onChange={(e) =>
                  setFilters({ ...filters, email: e.target.value })
                }
              />
            </div>
          </div>

          {/* fixed: no double toggle - the component handles toggle internally,
              here we just pass the value straight through */}
         <AdminRoleFilter
            value={filters.role}
            onChange={(role) =>
              setFilters({
                ...filters,
                role: filters.role === role ? "" : role,
              })
            }
          />

          <AdminStatusFilter
            value={filters.status}
            onChange={(status) =>
              setFilters({
                ...filters,
                status: filters.status === status ? "" : status,
              })
            }
          />
        </div>

        {/* TABLE */}
        <div className="admin-table-wrapper">
          <table className="admin-table wide">
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Active Challenge</th>
                <th>Created</th>
                <th>Challenge Started</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((u) => (
                // row class changes color based on user status
                <tr
                  key={u._id}
                  className={`status-${u.deletedAt ? "deleted" : u.status}`}
                >
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    {u.deletedAt
                      ? "Deleted"
                      : u.status
                      ? u.status.charAt(0).toUpperCase() + u.status.slice(1)
                      : "—"}
                  </td>
                  <td>{u.activeChallenge || "—"}</td>
                  <td>{u.createdAt?.slice(0, 10)}</td>
                  <td>{u.challengeStartedAt || "—"}</td>

                  <td className="admin-actions">
                    {/* show Suspend for active users, Activate for suspended */}
                    {u.status === "active" ? (
                      <button
                        onClick={() => suspendUser(u._id)}
                        className="admin-btn danger"
                      >
                        Suspend
                      </button>
                    ) : (
                      <button
                        onClick={() => activateUser(u._id)}
                        className="admin-btn success"
                      >
                        Activate
                      </button>
                    )}

                    <button
                      onClick={() => deleteUser(u._id)}
                      className="admin-btn danger-outline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {/* empty state when no users match filters */}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="7" className="admin-empty">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;
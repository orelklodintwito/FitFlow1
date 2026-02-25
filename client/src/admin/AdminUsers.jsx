import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../admin/admin.css";

import AdminRoleFilter from "./components/AdminRoleFilter";
import AdminStatusFilter from "./components/AdminStatusFilter";
import AdminChallengeFilter from "./components/AdminChallengeFilter";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
  }, []);

  /* ===================== ACTIONS ===================== */

  const suspendUser = async (id) => {
    const confirmAction = window.confirm(
      "Are you sure you want to suspend this user?"
    );
    if (!confirmAction) return;

    await api.patch(`/admin/users/${id}/suspend`);
    fetchUsers();
  };

  const activateUser = async (id) => {
    const confirmAction = window.confirm(
      "Are you sure you want to activate this user?"
    );
    if (!confirmAction) return;

    await api.patch(`/admin/users/${id}/activate`);
    fetchUsers();
  };

  const deleteUser = async (id) => {
    const confirmAction = window.confirm(
      "Are you sure you want to permanently delete this user?"
    );
    if (!confirmAction) return;

    await api.delete(`/admin/users/${id}`);
    fetchUsers();
  };

  /* ===================== FILTERS ===================== */
  const filteredUsers = users.filter((u) => {
    const matchEmail = u.email
      ?.toLowerCase()
      .includes(filters.email.toLowerCase());

    const matchRole = !filters.role || u.role === filters.role;
    const matchStatus =!filters.status ||
    (filters.status === "deleted" && u.deletedAt) ||
    (filters.status !== "deleted" && u.status === filters.status);
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
                <tr key={u._id} className={`status-${u.deletedAt ? "deleted" : u.status}`}> 
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
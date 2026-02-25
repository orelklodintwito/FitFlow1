import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./admin.css";

// layout wrapper for all admin pages
// renders the sticky header with nav + logout, and the page content below via Outlet
function AdminLayout() {
  const navigate = useNavigate();

  // clears auth data and sends the user back to login
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userProfile");
    navigate("/", { replace: true });
    window.location.reload(); // force full reload to reset any cached state
  };

  return (
    <>
      {/* ===== ADMIN HEADER ===== */}
      <header className="admin-header">
        {/* LEFT – Logo / home link */}
        <NavLink to="/admin" className="admin-logo">
          Admin Panel
        </NavLink>

        {/* CENTER – Navigation pills */}
        <nav className="admin-nav admin-nav-center">
          {/* "end" makes sure this is only active on exact /admin path */}
          <NavLink to="/admin" end className="admin-pill">
            Dashboard
          </NavLink>

          <NavLink to="/admin/users" className="admin-pill">
            Users
          </NavLink>
        </nav>

        {/* RIGHT – Logout */}
        <button className="admin-logout-pill" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* ===== CONTENT ===== */}
      {/* Outlet renders the matched child route (Dashboard / Users / etc.) */}
      <main className="admin-content">
        <Outlet />
      </main>
    </>
  );
}

export default AdminLayout;
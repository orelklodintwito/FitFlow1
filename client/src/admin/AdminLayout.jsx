import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./admin.css";

function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userProfile");
    navigate("/", { replace: true });
    window.location.reload();
  };

  return (
    <>
      {/* ===== ADMIN HEADER ===== */}
      <header className="admin-header">
        {/* LEFT – Logo */}
        <NavLink to="/admin" className="admin-logo">
          Admin Panel
        </NavLink>

        {/* CENTER – Navigation */}
        <nav className="admin-nav admin-nav-center">
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
      <main className="admin-content">
        <Outlet />
      </main>
    </>
  );
}

export default AdminLayout;

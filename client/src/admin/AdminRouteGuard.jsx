import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function AdminRouteGuard({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  try {
    const decoded = jwtDecode(token);

    if (decoded.role !== "admin") {
      return <Navigate to="/" replace />;
    }

    return children;
  } catch (err) {
    console.error("Invalid token", err);
    localStorage.removeItem("token");
    return <Navigate to="/" replace />;
  }
}

export default AdminRouteGuard;

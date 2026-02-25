import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// route guard that protects admin pages
// checks if the user has a valid token with admin role
// if not - redirects to home page
function AdminRouteGuard({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  // no token at all - redirect to login, save the current path
  // so we could redirect back after login if we wanted
  if (!token) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  try {
    const decoded = jwtDecode(token);

    // token exists but user isn't admin - send them home
    if (decoded.role !== "admin") {
      return <Navigate to="/" replace />;
    }

    // NOTE: this only checks the role inside the JWT on the client side.
    // the actual security happens on the backend (checking the token on each API call).
    // someone could fake the token on the client but the API would reject them anyway.

    // all good - render the protected page
    return children;
  } catch (err) {
    // token is corrupted or expired - clear it and redirect
    console.error("Invalid token", err);
    localStorage.removeItem("token");
    return <Navigate to="/" replace />;
  }
}

export default AdminRouteGuard;
// frontend/src/components/auth/PrivateRoute.jsx
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, allowedRoles = [] }) {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  if (!token || !userStr) return <Navigate to="/login" replace />;

  const user = JSON.parse(userStr);
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  }

  return children;
}
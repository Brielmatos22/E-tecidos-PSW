import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../js/useAuth.js";
import { hasPermission } from "../js/permissoes.js";

export default function RequirePermission({ permission, children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (!hasPermission(user, permission)) return <Navigate to="/" replace />;
  return children;
}
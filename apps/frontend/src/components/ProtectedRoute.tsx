// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = Cookies.get("ACCESSTOKEN");

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
}

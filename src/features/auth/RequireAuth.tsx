import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../state/authStore";

export default function RequireAuth({ children }: { children: React.ReactElement }) {
  const authed = useAuthStore((s) => s.isAuthed);
  const loc = useLocation();
  if (!authed) return <Navigate to="/signup" replace state={{ from: loc.pathname }} />;
  return children;
}

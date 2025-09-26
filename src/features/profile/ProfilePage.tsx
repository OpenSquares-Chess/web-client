import React from "react";
import { useAuthStore } from "../../state/authStore";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user); 

  return (
    <div className="container">
      <h2>Player Profile</h2>
      <div className="card" style={{ maxWidth: 520 }}>
        <div style={{ display: "grid", gap: 8 }}>
          <label style={{ color: "#666" }}>Name</label>
          <div className="input" style={{ borderColor: "#eee", background: "#fafafa" }}>
            {user?.username ?? "—"}
          </div>
        </div>
      </div>
    </div>
  );
}

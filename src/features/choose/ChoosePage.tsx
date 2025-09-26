import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../state/authStore";

export default function ChoosePage() {
  const user = useAuthStore((s) => s.user);
  return (
    <div className="container">
      <h2>Welcome, {user?.username ?? "Player"} 👋</h2>
      <div className="row" style={{ gap: 16, flexWrap: "wrap", marginTop: 12 }}>
        <Link to="/room" className="card" style={{ textDecoration: "none", width: 260 }}>
          <h3>Game Room</h3>
          <p>Join a room and play live chess.</p>
        </Link>
        <Link to="/profile" className="card" style={{ textDecoration: "none", width: 260 }}>
          <h3>Player Profile</h3>
          <p>View or edit your profile details.</p>
        </Link>
      </div>
    </div>
  );
}

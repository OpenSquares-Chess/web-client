import { Link } from "react-router-dom";

export default function Settings() {
  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h1>⚙️ Settings</h1>
      <p>Light/Dark mode toggle coming soon…</p>
      <p style={{ marginTop: 16 }}>
        <Link to="/dashboard">⬅ Back to Dashboard</Link>
      </p>
    </div>
  );
}

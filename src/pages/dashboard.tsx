import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h1>📋 Dashboard</h1>
      <ul style={{ listStyle: "none", padding: 0, marginTop: 16 }}>
        <li><Link to="/play">Find Match / Play</Link></li>
        <li><Link to="/history">Game History</Link></li>
        <li><Link to="/settings">Settings</Link></li>
      </ul>
      <p style={{ marginTop: 16 }}>
        <Link to="/">⬅ Back Home</Link>
      </p>
    </div>
  );
}

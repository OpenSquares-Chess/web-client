import { Link } from "react-router-dom";

export default function History() {
  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h1>📜 Game History</h1>
      <p>List of past games will appear here.</p>
      <p style={{ marginTop: 16 }}>
        <Link to="/dashboard">⬅ Back to Dashboard</Link>
      </p>
    </div>
  );
}

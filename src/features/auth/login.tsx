import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    alert(`Logging in with: ${email} / ${password}`);
  }

  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h1>🔑 Login</h1>
      <form onSubmit={handleLogin} style={{ marginTop: 16 }}>
        <input
          style={{ padding: 8, width: 260 }}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br /><br />
        <input
          style={{ padding: 8, width: 260 }}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br /><br />
        <button type="submit" style={{ padding: "8px 16px" }}>Login</button>
      </form>
      <p style={{ marginTop: 12 }}>
        No account? <Link to="/signup">Signup</Link>
      </p>
      <p style={{ marginTop: 12 }}>
        <Link to="/">⬅ Back Home</Link>
      </p>
    </div>
  );
}

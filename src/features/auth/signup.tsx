import { useState } from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    alert(`Signing up with: ${name}, ${email}, ${password}`);
  }

  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h1>📝 Signup</h1>
      <form onSubmit={handleSignup} style={{ marginTop: 16 }}>
        <input
          style={{ padding: 8, width: 260 }}
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        /><br /><br />
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
        <button type="submit" style={{ padding: "8px 16px" }}>Create Account</button>
      </form>
      <p style={{ marginTop: 12 }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
      <p style={{ marginTop: 12 }}>
        <Link to="/">⬅ Back Home</Link>
      </p>
    </div>
  );
}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../state/authStore";

async function fakeSignup(input: { username: string; email: string; password: string }) {
  await new Promise((r) => setTimeout(r, 400));
  const id = "u-" + (crypto.randomUUID?.() ?? Math.random().toString(36).slice(2));
  const token = "demo-" + Math.random().toString(36).slice(2);
  return { user: { id, username: input.username, email: input.email }, token };
}

export default function SignUpPage() {
  const n = useNavigate();
  const signIn = useAuthStore((s) => s.signIn);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!username || !email || !password) { setErr("Please fill all fields."); return; }
    setLoading(true);
    try {
      const { user, token } = await fakeSignup({ username, email, password });
      signIn(user, token);
      n("/choose");
    } catch {
      setErr("Sign up failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Create your account</h2>
      <form className="card" style={{ maxWidth: 520 }} onSubmit={submit}>
        <label>Username</label>
        <input className="input" value={username} onChange={(e)=>setUsername(e.target.value)} />

        <label style={{ marginTop: 8 }}>Email</label>
        <input className="input" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />

        <label style={{ marginTop: 8 }}>Password</label>
        <input className="input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />

        {err && <div style={{ color: "crimson", marginTop: 8 }}>{err}</div>}

        <div className="row" style={{ marginTop: 12 }}>
          <button className="btn primary" disabled={loading} type="submit">
            {loading ? "Creating…" : "Sign Up"}
          </button>
        </div>
      </form>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
import Signup from "./features/game/auth/Signup";
import { getSelfUser, createUser } from "./api/users";
import type { CreateUserRequest } from "./types/user";
import Game from "./features/game";
import Header from "./components/Header";

type Profile = { id: string; username: string };

export default function App() {
  const { keycloak, initialized } = useKeycloak();
  const [checking, setChecking] = useState(false);
  const [needsSignup, setNeedsSignup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  const isAuth = !!keycloak?.authenticated;

  async function loadProfile(token: string) {
    setChecking(true);
    setError(null);
    try {
      const u = await getSelfUser(token);
      if (u) {
        setProfile({ id: u.id, username: u.username });
        setNeedsSignup(false);
      } else {
        setProfile(null);
        setNeedsSignup(true);
      }
    } catch {
      setProfile(null);
      setNeedsSignup(true);
    } finally {
      setChecking(false);
    }
  }

  useEffect(() => {
    if (!initialized || !isAuth) return;
    const token = keycloak.token ?? "";
    if (token) loadProfile(token);
  }, [initialized, isAuth, keycloak?.token]);

  async function handleCreate(body: CreateUserRequest) {
    if (!keycloak.token) return;
    try {
      setBusy(true);
      setError(null);
      await createUser(keycloak.token, body);
      await loadProfile(keycloak.token);
      setNeedsSignup(false);
    } catch (e: any) {
      setError(e?.message || "Unable to create profile");
    } finally {
      setBusy(false);
    }
  }

  if (!initialized) {
    return (
      <div className="min-h-screen bg-[#1c1c24] text-[#cccccc] grid place-items-center">
        <div className="text-sm opacity-80">Initializing authentication…</div>
      </div>
    );
  }

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-[#1c1c24] text-[#cccccc]">
        <div className="px-6 pt-8 pb-6 text-center text-[100px] font-extrabold leading-none tracking-tight">
          <span className="text-[#eedc97]">OPEN</span>
          <span className="text-[#964d22]">SQUARES</span>
        </div>
        <div className="px-4 pb-16 flex justify-center">
          <button
            onClick={() => keycloak.login()}
            className="rounded-xl bg-[#964d22] hover:bg-[#7f3f1c] px-5 py-2.5 text-white shadow-lg shadow-black/30 focus:outline-none focus:ring-4 focus:ring-[#eedc97]/20"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-[#1c1c24] text-[#cccccc] grid place-items-center">
        <div className="text-sm opacity-80">Checking profile…</div>
      </div>
    );
  }

  if (needsSignup) {
    return (
      <div className="min-h-screen bg-[#1c1c24] text-[#cccccc]">
        <div className="px-6 pt-8 pb-6 text-center text-[100px] font-extrabold leading-none tracking-tight">
          <span className="text-[#eedc97]">OPEN</span>
          <span className="text-[#964d22]">SQUARES</span>
        </div>
        <div className="px-4 pb-16 flex justify-center">
          <Signup onSubmit={handleCreate} busy={busy} error={error} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1c1c24] text-[#cccccc]">
      <Header username={profile?.username || "Player"} />
      <main className="mx-auto max-w-6xl px-4 py-6 flex justify-center">
        <div className="mx-auto" style={{ width: "min(95vw, 1080px)" }}>
          <Game subject={keycloak.tokenParsed?.sub || ""} />
        </div>
      </main>
    </div>
  );
}

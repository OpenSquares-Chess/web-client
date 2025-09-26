import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "../state/authStore";

export default function Header() {
  const { pathname } = useLocation();
  const n = useNavigate();
  const isAuthed = useAuthStore((s) => s.isAuthed);
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  useEffect(() => {
    const map: Record<string, string> = {
      "/": "Home",
      "/signup": "Sign Up",
      "/choose": "Choose",
      "/room": "Game Room",
      "/profile": "Profile",
    };
    const suffix = map[pathname] ?? "App";
    document.title = `OpenSquares-Chess — ${suffix}`;
  }, [pathname]);

  const NavLink = (to: string, label: string) => (
    <Link to={to} className="btn" style={{ fontWeight: pathname === to ? 700 : 400 }}>
      {label}
    </Link>
  );

  return (
    <div className="app-header">
      <div className="container">
        <Link to="/" style={{ textDecoration: "none", fontWeight: 700, fontSize: 18, marginRight: 12 }}>
          OpenSquares-Chess
        </Link>
        {NavLink("/", "Home")}
        {isAuthed && NavLink("/choose", "Choose")}
        {isAuthed && NavLink("/room", "Game Room")}
        {isAuthed && NavLink("/profile", "Profile")}
        <div style={{ marginLeft: "auto" }} />
        {!isAuthed ? (
          NavLink("/signup", "Sign Up")
        ) : (
          <button
            className="btn"
            onClick={() => {
              signOut();
              n("/signup", { replace: true });
            }}
          >
            Sign Out {user ? `(${user.username})` : ""}
          </button>
        )}
      </div>
    </div>
  );
}

import { createBrowserRouter, Navigate } from "react-router-dom";
import GameRoom from "../features/game/GameRoom";
import ProfilePage from "../features/profile/ProfilePage";
import Header from "../components/Header";
import SignUpPage from "../features/auth/SignUpPage";
import RequireAuth from "../features/auth/RequireAuth";
import ChoosePage from "../features/choose/ChoosePage";
import { useAuthStore } from "../state/authStore";

function Home() {
  const authed = useAuthStore((s) => s.isAuthed);
  return (
    <div className="container">
      <h1>OpenSquares-Chess</h1>
      <p>Welcome!</p>
      {authed ? (
        <p>Go to <a href="/choose">Choose</a> to enter the Game Room or your Profile.</p>
      ) : (
        <p>Please <a href="/signup">Sign Up</a> to continue.</p>
      )}
    </div>
  );
}

export const router = createBrowserRouter([
  { path: "/", element: (<><Header /><Home /></>) },
  { path: "/signup", element: (<><Header /><SignUpPage /></>) },
  {
    path: "/choose",
    element: (
      <>
        <Header />
        <RequireAuth><ChoosePage /></RequireAuth>
      </>
    ),
  },
  {
    path: "/room",
    element: (
      <>
        <Header />
        <RequireAuth><GameRoom /></RequireAuth>
      </>
    ),
  },
  {
    path: "/profile",
    element: (
      <>
        <Header />
        <RequireAuth><ProfilePage /></RequireAuth>
      </>
    ),
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);

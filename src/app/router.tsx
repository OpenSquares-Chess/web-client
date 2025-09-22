import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Login from "../features/auth/Login";
import Signup from "../features/auth/Signup";
import Play from "../features/game/Play";
import History from "../pages/History";
import Settings from "../pages/Settings";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/play", element: <Play /> },
  { path: "/history", element: <History /> },
  { path: "/settings", element: <Settings /> },
]);

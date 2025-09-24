import { createBrowserRouter } from "react-router-dom";
import Login from "../features/auth/login";  
import GameRoom from "../features/game/play";  

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/play",
    element: <GameRoom />,
  },
]);

export default router;

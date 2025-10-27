import { createRoot } from 'react-dom/client'
import { ReactKeycloakProvider } from '@react-keycloak/web';
import './index.css'
import App from './App.tsx'
import { keycloak, initOptions } from './keycloak';

createRoot(document.getElementById('root')!).render(
  <ReactKeycloakProvider authClient={keycloak} initOptions={initOptions}>
    <App />
  </ReactKeycloakProvider>
)

/*import React from "react";
import ReactDOM from "react-dom/client";
import SignupPreview from "./pages/signuppreview";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SignupPreview />
  </React.StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import GamePreview from "./pages/gamepreview"; 
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GamePreview />
  </React.StrictMode>
);
*/

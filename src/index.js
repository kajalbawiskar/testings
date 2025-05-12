import React from "react";
import ReactDOM from "react-dom";

import "./index.css";
import App from "./App";
import { ContextProvider } from "./contexts/ContextProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.render(
  <GoogleOAuthProvider clientId="784240047961-l599fdt46lag2p9t3blr91jdmfeb7hnt.apps.googleusercontent.com">
    <React.StrictMode>
      <ContextProvider>
        <App />
      </ContextProvider>
    </React.StrictMode>
    ,
  </GoogleOAuthProvider>,
  document.getElementById("root")
);

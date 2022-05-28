import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// react router
import { BrowserRouter } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import { UserProvider } from "./provider/UserProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <CookiesProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </CookiesProvider>
    </BrowserRouter>
  </React.StrictMode>
);

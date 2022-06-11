import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// react router
import { BrowserRouter } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import { UserProvider } from "./provider/UserProvider";

// redux
import { store } from "./store/store";
import { Provider as ReduxProvider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <CookiesProvider>
        <UserProvider>
          <ReduxProvider store={store}>
            <App />
          </ReduxProvider>
        </UserProvider>
      </CookiesProvider>
    </BrowserRouter>
  </React.StrictMode>
);

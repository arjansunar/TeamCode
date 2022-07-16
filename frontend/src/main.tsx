import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// react router
import { BrowserRouter } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
// providers
import { UserProvider } from "./provider/UserProvider";

// redux
import { store } from "./store/store";
import { Provider as ReduxProvider } from "react-redux";
import { MeetingProvider } from "./common/meetingDetails";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <BrowserRouter>
      <CookiesProvider>
        <ReduxProvider store={store}>
          <MeetingProvider>
            <UserProvider>
              <App />
            </UserProvider>
          </MeetingProvider>
        </ReduxProvider>
      </CookiesProvider>
    </BrowserRouter>
  </>
);

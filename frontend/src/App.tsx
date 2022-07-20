import {
  FC,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import colors from "./theme/colors.json";

// react router
import { Routes, Route, Navigate } from "react-router-dom";
// pages
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import Editor from "./pages/Editor";
import Room from "./pages/testchat/Room";
import { LayoutSidebar } from "./layout";
import Notification from "./pages/Notification";
import Error from "./pages/Error";
import Meeting from "./pages/Meeting";
import { ProtectedRoutes } from "./components/routing/ProtectedRoutes";
import ShareCode from "./pages/ShareCode";
import { RoleBasedProtectedRoute } from "./components/routing/RoleBasedProtectedRoute";
import { MeetingIdNeeded } from "./components/routing/MeetingIdProtectedRoute";

const GlobalStyleWithReset = createGlobalStyle`
${reset}
body {
  font-family: 'Open Sans', sans-serif;
  color: ${colors.theme["text-light"]};
  box-sizing: border-box;
}

*, *::before, *::after{
  box-sizing: border-box;

}

*{
   /* width */
::-webkit-scrollbar {
  width: 6px;
}

/* Track */
::-webkit-scrollbar-track {
  background: ${colors.theme["dark-400"]};
  border-radius: 0.2rem;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: ${colors.theme["dark-300"]};
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: ${colors.theme["dark-500"]};
}
}
`;

const Home = () => <div>Home</div>;
function App() {
  return (
    <div className="App">
      <GlobalStyleWithReset />
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* protected routes */}
        <Route element={<ProtectedRoutes />}>
          {/* <Route
            path="/"
            element={
              <SideBarWrapper>
                <Home />
              </SideBarWrapper>
            }
          /> */}
          <Route path="/" element={<Navigate to="/meeting" replace />} />
          <Route element={<MeetingIdNeeded />}>
            <Route
              path="/chat"
              element={
                <SideBarWrapper>
                  <Chat />
                </SideBarWrapper>
              }
            />
            <Route
              path="/editor"
              element={
                <SideBarWrapper>
                  <Editor />
                </SideBarWrapper>
              }
            />
            <Route element={<RoleBasedProtectedRoute />}>
              <Route
                path="/notification"
                element={
                  <SideBarWrapper>
                    <Notification />
                  </SideBarWrapper>
                }
              />
            </Route>
          </Route>
          <Route
            path="/meeting"
            element={
              <SideBarWrapper>
                <Meeting />
              </SideBarWrapper>
            }
          />
          <Route
            path="/room/:roomId"
            element={
              <SideBarWrapper>
                <Room />
              </SideBarWrapper>
            }
          />
          <Route path="/share" element={<ShareCode />} />
          <Route path="*" element={<Error />} />
        </Route>
        {/* end protected routes */}
      </Routes>
    </div>
  );
}

const SideBarWrapper = ({ children }: { children: ReactNode }) => (
  <LayoutSidebar>{children}</LayoutSidebar>
);

export default App;

import { FC, ReactElement, ReactNode, useState } from "react";
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import colors from "./theme/colors.json";

// react router
import { Routes, Route } from "react-router-dom";
// pages
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import Editor from "./pages/Editor";
import Room from "./pages/testchat/Room";
import { LayoutSidebar } from "./layout";
import Notification from "./pages/Notification";

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
function App() {
  const Home = () => <div>home</div>;

  return (
    <div className="App">
      <GlobalStyleWithReset />
      <Routes>
        <Route
          path="/"
          element={
            <SideBarWrapper>
              <Home />
            </SideBarWrapper>
          }
        />
        <Route path="/login" element={<Login />} />
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
        <Route
          path="/notification"
          element={
            <SideBarWrapper>
              <Notification />
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
      </Routes>
    </div>
  );
}

const SideBarWrapper = ({ children }: { children: ReactNode }) => (
  <LayoutSidebar>{children}</LayoutSidebar>
);

export default App;

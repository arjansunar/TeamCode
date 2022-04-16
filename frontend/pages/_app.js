import "../styles/globals.css";
import { LayoutSidebar } from "../src/layout";
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const GlobalStyleWithReset = createGlobalStyle`
  ${reset}
`;

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GlobalStyleWithReset />
      <LayoutSidebar>
        <Component {...pageProps} />
      </LayoutSidebar>
    </>
  );
}

export default MyApp;

import "../styles/globals.css";
import { LayoutSidebar } from "../src/layout";
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import colors from "../src/theme/colors.json";

const GlobalStyleWithReset = createGlobalStyle`
  ${reset}
  body {
    font-family: 'Open Sans', sans-serif;
    color: ${colors.theme["text-light"]};
  }
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

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
    background: ${colors.theme["dark-600"]};
  }
  }
`;
function sideBarLayout(page) {
  return <LayoutSidebar>{page}</LayoutSidebar>;
}

function MyApp({ Component, pageProps }) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || sideBarLayout;

  return (
    <>
      <GlobalStyleWithReset />

      {getLayout(<Component {...pageProps} />)}
    </>
  );
}

export default MyApp;

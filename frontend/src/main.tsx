import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import { ChakraProvider, extendTheme, CSSReset } from "@chakra-ui/react";

const colors = {
  brand: {
    900: "#000000",
    800: "#3E065F",
    700: "#700B97",
    600: "#8E05C2",
  },
};

const theme = extendTheme({ colors });

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <CSSReset />
      <App />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

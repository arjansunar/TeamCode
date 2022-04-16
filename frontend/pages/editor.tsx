import dynamic from "next/dynamic";
import React from "react";
// import { EditorMonacoView } from "../src/components";
const AceEditor = dynamic(import("../src/components/AceEditor"), {
  ssr: false,
});
type Props = {};

const editor = (props: Props) => {
  return <AceEditor />;
};

export default editor;

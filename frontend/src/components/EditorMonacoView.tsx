import dynamic from "next/dynamic";
import { useState } from "react";
const MonacoEditor = dynamic(import("react-monaco-editor"), { ssr: false });

type Props = {};

export const EditorMonacoView = (props: Props) => {
  const [codeBody, setCodeBody] = useState("");
  return (
    <div className="">
      <p className="">hello</p>
      <MonacoEditor
        editorDidMount={() => {
          // @ts-ignore
          window.MonacoEnvironment.getWorkerUrl = (
            _moduleId: string,
            label: string
          ) => {
            if (label === "json") return "_next/static/json.worker.js";
            if (label === "css") return "_next/static/css.worker.js";
            if (label === "html") return "_next/static/html.worker.js";
            if (label === "typescript" || label === "javascript")
              return "_next/static/ts.worker.js";
            return "_next/static/editor.worker.js";
          };
        }}
        width="800"
        height="600"
        language="markdown"
        theme="vs-dark"
        value={codeBody}
        options={{
          minimap: {
            enabled: false,
          },
        }}
        onChange={setCodeBody}
      />
    </div>
  );
};

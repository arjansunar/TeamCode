import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import colors from "../theme/colors.json";

import { diff as DiffEditor } from "react-ace";

import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/snippets/javascript";
import "ace-builds/src-noconflict/mode-javascript";

import { useState } from "react";

type Props = {};

const ShareCode = (props: Props) => {
  const [searchParams] = useSearchParams();

  const code = searchParams.get("code");
  if (!code) return <Container>No code Provided</Container>;
  const parsedCode = atob(code);

  const [valuesArr, setValuesArr] = useState([parsedCode, parsedCode]);

  const handleChange = (valuesArray: string[]) => {
    const rightEdits = valuesArray[1];
    setValuesArr([parsedCode, rightEdits]);
  };
  return (
    <Container>
      <DiffEditor
        value={valuesArr}
        height="100vh"
        width="100vw"
        theme="dracula"
        mode="javascript"
        fontSize={18}
        readOnly={false}
        enableBasicAutocompletion
        enableLiveAutocompletion
        tabSize={2}
        showGutter
        showPrintMargin
        setOptions={{
          enableSnippets: true,
          showLineNumbers: true,
          useWorker: false,
        }}
        onChange={handleChange}
      />
    </Container>
  );
};

export default ShareCode;

const Container = styled.div`
  height: 100vh;
  background-color: ${colors["bg-dark"]};
`;

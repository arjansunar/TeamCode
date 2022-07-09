import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import colors from "../theme/colors.json";

import { diff as DiffEditor } from "react-ace";

import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/snippets/javascript";
import "ace-builds/src-noconflict/mode-javascript";

import { useContext, useState } from "react";
import { UserContext, UserData } from "../provider/UserProvider";
import { ReadOnly } from "./Editor";

type Props = {};

const ShareCode = (props: Props) => {
  const [searchParams] = useSearchParams();
  const { user }: { user: UserData } = useContext(UserContext);

  const code = searchParams.get("code");
  const shareToId = searchParams.get("shareTo");
  const from = searchParams.get("from");
  const readOnly = searchParams.get("readOnly");

  if (!code) return <ErrorContainer>No code Provided</ErrorContainer>;
  const parsedCode = atob(code);

  const [valuesArr, setValuesArr] = useState([parsedCode, parsedCode]);

  const handleChange = (valuesArray: string[]) => {
    const rightEdits = valuesArray[1];
    setValuesArr([parsedCode, rightEdits]);
  };

  // control flow
  if (!shareToId) {
    return <ErrorContainer>No permission</ErrorContainer>;
  }
  if (!from) {
    return <ErrorContainer>No permission</ErrorContainer>;
  }
  if (+shareToId !== user.id && +from !== user.id) {
    return <ErrorContainer>No permission</ErrorContainer>;
  }

  return (
    <Container>
      <DiffEditor
        value={valuesArr}
        height="100vh"
        width="100vw"
        theme="dracula"
        mode="javascript"
        fontSize={18}
        readOnly={readOnly == ReadOnly.TRUE}
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

const ErrorContainer = styled.div`
  padding-top: 3rem;
  height: 100vh;
  background-color: ${colors["bg-dark"]};
  color: red;
  display: flex;
  justify-content: center;
`;

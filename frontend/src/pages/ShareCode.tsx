import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import colors from "../theme/colors.json";

import { diff as DiffEditor } from "react-ace";

import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/snippets/javascript";
import "ace-builds/src-noconflict/mode-javascript";

import { useContext, useEffect, useState } from "react";
import { UserContext, UserData } from "../provider/UserProvider";
import { Button, ReadOnly, SettingsWrapper } from "./Editor";

import SocketIoClient, { Socket } from "socket.io-client";
import { MeetingContext } from "../common/meetingDetails";
import CopyToClipboard from "react-copy-to-clipboard";

import { AiFillCopy as CopyIcon } from "react-icons/ai";
import { FaClipboardCheck as CopiedIcon } from "react-icons/fa";

type Props = {};

const ShareCode = (props: Props) => {
  const [searchParams] = useSearchParams();
  const { user }: { user: UserData } = useContext(UserContext);
  const { ws }: { ws: Socket } = useContext(MeetingContext);

  const code = searchParams.get("code");
  const shareToId = searchParams.get("shareTo");
  const from = searchParams.get("from");
  const readOnly = searchParams.get("readOnly");
  const roomId = searchParams.get("roomId");

  const [isCopied, setIsCopied] = useState(false);

  if (!code) return <ErrorContainer>No code Provided</ErrorContainer>;
  const parsedCode = atob(code);

  const [valuesArr, setValuesArr] = useState([parsedCode, parsedCode]);

  const handleChange = (valuesArray: string[]) => {
    const rightEdits = valuesArray[1];
    ws.emit("sh-send-message", { roomId, code: rightEdits });
    setValuesArr([parsedCode, rightEdits]);
  };

  // web socket events

  useEffect(() => {
    ws.emit("sh-join-room", { roomId: roomId });
    ws.on("message", (data) => {
      setValuesArr([parsedCode, data.code]);
    });
  }, [ws]);

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
      <SpacerP>
        <CopyToClipboard
          text={valuesArr[1]}
          onCopy={() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 1500);
          }}
        >
          <Button>
            {isCopied ? <CopiedIcon /> : <CopyIcon />}
            Copy
          </Button>
        </CopyToClipboard>
      </SpacerP>
      <DiffEditor
        value={valuesArr}
        height="100%"
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
  display: grid;
  grid-template-rows: 50px 1fr;
  overflow: hidden;
`;

const SpacerP = styled.div`
  padding: 5px;
  padding-right: 1rem;

  display: flex;
  justify-content: end;
`;

const ErrorContainer = styled.div`
  padding-top: 3rem;
  height: 100vh;
  background-color: ${colors["bg-dark"]};
  color: red;
  display: flex;
  justify-content: center;
`;

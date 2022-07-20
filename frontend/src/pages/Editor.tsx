import { AxiosResponse } from "axios";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { ExecutionResults } from "../api/hooks/types/CodeExecutionRes";
import { axiosJudge0 } from "../api/hooks/useAxios";
/* components */
import { OutputScreen } from "../components";
import colors from "../theme/colors.json";

import AceEditor from "../components/AceEditor";
import { ScaleLoader } from "react-spinners";
import { UserContext, UserData } from "../provider/UserProvider";
type Props = {};

// react modal
import Modal from "react-modal";
import ChatUsers from "../components/chat/ChatUsers";
import { useDispatch, useSelector } from "react-redux";
import {
  getSelectedParticipant,
  setSelected,
} from "../store/features/selectedParticipant";
import { Participant } from "../store/features/participants";
import CopyToClipboard from "react-copy-to-clipboard";

import { AiFillCopy as CopyIcon } from "react-icons/ai";
import { FaClipboardCheck as CopiedIcon } from "react-icons/fa";

import { v4 as uuid } from "uuid";

interface SubmissionSchema {
  language_id: number;
  source_code: string;
  stdin: string;
}
const jsSubmissionSchema = (code: string): SubmissionSchema => {
  return {
    language_id: 63,
    source_code: code,
    stdin: "",
  };
};
const submissionHeaders = {
  "content-type": "application/json",
  "Content-Type": "application/json",
};
// creates a instance for code execution and returns the token to access the execution data
const createSubmission = (code: string) => {
  const encodedCode = btoa(code);
  const jsSubmission = jsSubmissionSchema(encodedCode);
  return jsSubmission;
};

const getSubmissionToken = async (
  code: string
): Promise<{ data: { token: string } }> => {
  const createSubmissionData = createSubmission(code);
  return await axiosJudge0.post("submissions", createSubmissionData, {
    headers: submissionHeaders,
    params: { base64_encoded: "true" },
  });
};

const getSubmissionResults = async (
  token: string
): Promise<AxiosResponse<ExecutionResults>> => {
  return await axiosJudge0.get(`submissions/${token}`, {
    params: { base64_encoded: "false" },
  });
};

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "none",
    border: "none",
    minWidth: "500px",
  },
  overlay: {
    zIndex: 9999,
    backgroundColor: colors.theme["dark-300"],
  },
};

Modal.setAppElement("#root");

export enum ReadOnly {
  TRUE = "faksdfjajcpac",
  False = "ciajskl;djadf",
}

const Editor = (props: Props) => {
  const { user }: { user: UserData } = useContext(UserContext);
  const [code, setCode] = useState<string>("");
  const selectedUser = useSelector(getSelectedParticipant);
  const [output, setOutput] = useState<ExecutionResults>(
    {} as ExecutionResults
  );

  const [isCopied, setIsCopied] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);

  const [shareLink, setShareLink] = useState<string>("");

  const [codeExecutionLoading, setCodeExecutionLoading] = useState(false);

  const handleRunButton = async () => {
    if (code.length < 1) {
      alert("No code written!!");
      return;
    }
    try {
      setCodeExecutionLoading(true);
      const { data: submission } = await getSubmissionToken(code);
      const { data: results } = await getSubmissionResults(submission.token);
      setCodeExecutionLoading(false);
      setOutput(results);
    } catch (e) {
      console.log(e);
    }
  };
  const getEncodedCode = () => {
    return btoa(code);
  };

  const handleShareButton = () => {
    if (code.length < 1) {
      alert("No code written!!");
      return;
    }
    setIsReadOnly(false);
    openModal();
  };
  const handleShareReadOnlyButton = () => {
    if (code.length < 1) {
      alert("No code written!!");
      return;
    }
    setIsReadOnly(true);
    openModal();
    // alert("share link: " + shareLink);
  };

  const [modalIsOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  // useEffect(() => {
  //   if (selectedUser && Object.keys(selectedUser).length > 0) {
  //     setTimeout(() => {
  //       dispatch(setSelected({} as Participant));
  //     }, 2000);
  //   }
  // }, [modalIsOpen, selectedUser]);

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    if (selectedUser && selectedUser.id) {
      setIsModalOpen(false);
    }
  }

  useEffect(() => {
    if (Object.keys(selectedUser).length > 0) {
      setShareLink(
        `http://localhost:3000/share?from=${user.id}&code=${btoa(
          code
        )}&shareTo=${selectedUser.id}&readOnly=${
          isReadOnly ? ReadOnly.TRUE : ReadOnly.False
        }&roomId=${uuid()}`
      );
    }
  }, [selectedUser, isReadOnly, code]);

  return (
    <Container>
      <SettingsWrapper>
        {!codeExecutionLoading ? (
          <Button onClick={handleRunButton} disabled={codeExecutionLoading}>
            Run
          </Button>
        ) : (
          <LoaderWrapper>
            <ScaleLoader height={20} color={colors.theme["text-light"]} />
          </LoaderWrapper>
        )}
        <Button onClick={handleShareButton}>Share</Button>
        <Button onClick={handleShareReadOnlyButton}>Read Only</Button>
      </SettingsWrapper>
      <AceEditor code={code} setCode={setCode} />
      <OutputScreen output={output} />

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
        shouldCloseOnEsc
      >
        <DisplayRoomLink>PARTICIPANTS</DisplayRoomLink>
        <ChatUsers selectable />
        {!!selectedUser && Object.keys(selectedUser).length > 0 ? (
          <CopyToClipboard
            text={shareLink}
            onCopy={() => {
              setIsCopied(true);
              setTimeout(() => setIsCopied(false), 1500);
            }}
          >
            <DisplayRoomLink>
              {isCopied ? <CopiedIcon /> : <CopyIcon />}
              {shareLink}
            </DisplayRoomLink>
          </CopyToClipboard>
        ) : null}
      </Modal>
    </Container>
  );
};

const Container = styled.main`
  display: grid;
  grid-template-rows: 6vh 64vh 30vh;
  overflow: hidden;
`;

export const SettingsWrapper = styled.div`
  background-color: ${colors["bg-dark"]};
  height: 100%;
  display: flex;
  gap: 1rem;
  padding: 5px;
  padding-left: 40%;
`;
const LoaderWrapper = styled.div`
  background-color: #4a99de;
  padding: 8px 13px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.2rem;
`;
export const Button = styled.button`
  background-color: #4a99de;
  border: none;
  font-size: 16px;
  padding: 5px 18px;
  color: ${colors["bg-light"]};
  border-radius: 0.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  max-height: fit-content;
  cursor: pointer;

  &:disabled {
    background-color: ${colors.theme["dark-400"]};
  }
`;

const DisplayRoomLink = styled.div`
  background-color: ${colors.theme["dark-800"]};
  padding: 1rem 1.3rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.15rem;
  cursor: pointer;
`;
export default Editor;

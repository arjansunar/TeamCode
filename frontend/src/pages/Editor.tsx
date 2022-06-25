import { AxiosResponse } from "axios";
import { useContext, useState } from "react";
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

const Editor = (props: Props) => {
  const { user }: { user: UserData } = useContext(UserContext);
  const [code, setCode] = useState<string>("");
  const [output, setOutput] = useState<ExecutionResults>(
    {} as ExecutionResults
  );

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

  const handleShareButton = () => {
    if (code.length < 1) {
      alert("No code written!!");
      return;
    }
    const encodedCode = btoa(code);
    const shareLink = `http://localhost:3000/share?from=${user.id}&?code=${encodedCode}`;
    alert("share link: " + shareLink);
  };

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
      </SettingsWrapper>
      <AceEditor code={code} setCode={setCode} />
      <OutputScreen output={output} />
    </Container>
  );
};

const Container = styled.main`
  display: grid;
  grid-template-rows: 6vh 64vh 30vh;
  overflow: hidden;
`;

const SettingsWrapper = styled.div`
  background-color: ${colors["bg-dark"]};
  height: 100%;
  display: flex;
  gap: 1rem;
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
const Button = styled.button`
  background-color: #4a99de;
  border: none;
  font-size: 16px;
  padding: 8px 18px;
  color: ${colors["bg-light"]};
  border-radius: 0.2rem;
  cursor: pointer;

  &:disabled {
    background-color: ${colors.theme["dark-400"]};
  }
`;
export default Editor;

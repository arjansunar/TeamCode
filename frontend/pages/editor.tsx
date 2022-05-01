import { AxiosResponse } from "axios";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ExecutionResults } from "../src/api/hooks/types/CodeExecutionRes";
import { axiosJudge0 } from "../src/api/hooks/useAxios";
/* components */
import { OutputScreen } from "../src/components";
import colors from "../src/theme/colors.json";
const AceEditor = dynamic(import("../src/components/AceEditor"), {
  ssr: false,
});
type Props = {};

interface SubmissionSchema {
  language_id: number;
  source_code: string;
  stdin: string;
}
const jsSubmissionSchema = (code): SubmissionSchema => {
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
  const encodedCode = Buffer.from(code).toString("base64");
  console.log({ encodedCode });
  const jsSubmission = jsSubmissionSchema(encodedCode);
  return jsSubmission;
};

const getSubmissionToken = async (
  code
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

const useGetSubmission = (token: string) => {};

const editor = (props: Props) => {
  const [code, setCode] = useState<string>("");

  const handleRunButton = async () => {
    console.log({ code });
    try {
      const { data: submission } = await getSubmissionToken(code);
      const { data: results } = await getSubmissionResults(submission.token);

      console.log({ results });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Container>
      <SettingsWrapper>
        <Button onClick={handleRunButton}>Run </Button>
      </SettingsWrapper>
      <AceEditor code={code} setCode={setCode} />
      <OutputScreen />
    </Container>
  );
};

const Container = styled.main`
  display: grid;
  grid-template-rows: 5vh 65vh 1fr;
`;

const SettingsWrapper = styled.div`
  background-color: ${colors["bg-dark"]};
  height: 100%;
`;

const Button = styled.button`
  background-color: #4a99de;
  border: none;
  font-size: 16px;
  padding: 8px 18px;
  color: ${colors["bg-light"]};
  border-radius: 0.2rem;
  cursor: pointer;
`;
export default editor;

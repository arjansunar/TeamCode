import React from "react";
import styled from "styled-components";

import colors from "../theme/colors.json";

import { ExecutionResults } from "../api/hooks/types/CodeExecutionRes";

type Props = {
  output: ExecutionResults;
};

export const OutputScreen = ({ output }: Props) => {
  const { status, stderr, stdout } = output;
  if (stderr) {
    return <ErrorWrapper>{JSON.stringify(stderr)}</ErrorWrapper>;
  }
  return <Wrapper>{stdout}</Wrapper>;
};

const Wrapper = styled.section`
  height: 100%;
  background-color: ${colors["theme"]["dark-300"]};
  white-space: pre-line;
  padding: 1rem 2rem;
  overflow-y: scroll;
`;

const ErrorWrapper = styled(Wrapper)`
  color: red;
  line-height: 1.3rem;
`;

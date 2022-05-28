import styled from "styled-components";

type Props = {};

const Error = (props: Props) => {
  return <ErrorMessage>You have an Error</ErrorMessage>;
};

const ErrorMessage = styled.div`
  color: red;
`;

export default Error;

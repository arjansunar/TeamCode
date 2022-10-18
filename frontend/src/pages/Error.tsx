import styled from "styled-components";
import colors from "../theme/colors.json";

type Props = {};

const Error = (props: Props) => {
  return (
    <Container className="">
      <ErrorTitle>404</ErrorTitle>
      <ErrorMessage>Page Not Found</ErrorMessage>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: ${colors["theme"]["dark-800"]};
`;
const ErrorMessage = styled.div`
  color: ${colors.theme["text-light-muted"]};
  font-size: 2rem;
  line-height: 1.5em;
`;

const ErrorTitle = styled.h2`
  font-size: 6rem;
  line-height: 1em;
  font-style: italic;
  font-weight: bold;
  color: ${colors["theme"]["dark-300"]};
`;

export default Error;

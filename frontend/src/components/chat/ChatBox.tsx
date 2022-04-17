import React from "react";
import styled from "styled-components";
import colors from "../../theme/colors.json";

type Props = {};

const ChatBox = (props: Props) => {
  return <Container>ChatBox</Container>;
};

export default ChatBox;

const Container = styled.div`
  background-color: ${colors.theme["dark-800"]};
  padding: 1rem 1.5rem;
`;

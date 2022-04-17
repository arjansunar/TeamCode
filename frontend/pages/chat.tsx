import React from "react";
import styled from "styled-components";
import ChatBox from "../src/components/chat/ChatBox";
import ChatUsers from "../src/components/chat/ChatUsers";

type Props = {};

const chat = (props: Props) => {
  return (
    <Container>
      <ChatUsers />
      <ChatBox />
    </Container>
  );
};

export default chat;

const Container = styled.main`
  display: grid;
  grid-template-columns: 30vw 1fr;
  height: 100%;
`;

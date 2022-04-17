import React from "react";
import styled from "styled-components";
import colors from "../../theme/colors.json";

type Props = {};

const ChatBox = (props: Props) => {
  return (
    <Container>
      <Header>
        <Img src="https://avatars.githubusercontent.com/u/55166361?v=4" />
        <Name>Aakanshya Gahatraj</Name>
      </Header>
    </Container>
  );
};

export default ChatBox;

const Container = styled.div`
  background-color: ${colors.theme["dark-800"]};
`;

const Header = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 2rem;
  position: sticky;
  padding: 0.4rem 3rem;

  border-bottom: 3px solid ${colors.theme["dark-300"]};
  border-radius: 0 0 2px 2px;
`;

const Name = styled.h3``;
const Img = styled.img`
  height: 2rem;
  width: 2rem;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
`;

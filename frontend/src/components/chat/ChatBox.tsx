import React from "react";
import { AiFillPropertySafety } from "react-icons/ai";
import styled, { css } from "styled-components";
import colors from "../../theme/colors.json";

type Props = {};

const user = {
  id: 1,
  name: "Arjan Sunar",
  photo: "https://avatars.githubusercontent.com/u/55121485?v=4",
};
const MESSAGES = [
  {
    id: 1,
    message: "hello",
  },
  {
    id: 2,
    message: "hi back",
  },
];

const ChatBox = (props: Props) => {
  return (
    <Container>
      <Header>
        <Img src="https://avatars.githubusercontent.com/u/55166361?v=4" />
        <Name>Aakanshya Gahatraj</Name>
      </Header>
      <Body>
        {!!MESSAGES ? (
          MESSAGES.map((el, i) => {
            return <Message isMe={user.id === el.id}>{el.message}</Message>;
          })
        ) : (
          <h3>Send a message</h3>
        )}
      </Body>
      <Footer></Footer>
    </Container>
  );
};

export default ChatBox;

const Container = styled.div`
  background-color: ${colors.theme["dark-800"]};
  display: grid;
  grid-template-rows: 60px 1fr 80px;
`;

const Header = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 2rem;
  position: sticky;
  padding: 0 3rem;

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

const Body = styled.section`
  display: flex;
  flex-direction: column;
  padding: 1rem 2rem;
  font-size: smaller;
  gap: 1rem;
`;

interface MessageProps {
  isMe: boolean;
}

const messageBlueColor = colors.theme.message["bg-light-blue"];
const MessageBlue = css`
  background-color: ${messageBlueColor};
  align-self: flex-end;
  border-radius: 1em 2px 1em 1em;
`;

const Message = styled.p<MessageProps>`
  padding: 0.6rem 0.7rem;
  width: fit-content;
  background-color: ${colors.theme.message["bg-gray"]};
  position: relative;
  border-radius: 2px 1em 1em 1em;

  ${({ isMe }) => (isMe ? MessageBlue : null)}
`;

const Footer = styled.section`
  background-color: ${colors.theme["dark-400"]};
  padding: 0.8rem 2rem;
`;

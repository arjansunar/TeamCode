import { useSelector } from "react-redux";
import styled from "styled-components";
import ChatBox from "../components/chat/ChatBox";
import ChatUsers from "../components/chat/ChatUsers";
import { getSelectedParticipant } from "../store/features/selectedParticipant";

type Props = {};

const Chat = (props: Props) => {
  return (
    <Container>
      <ChatUsers />
      <ChatBox />
    </Container>
  );
};

export default Chat;

const Container = styled.main`
  display: grid;
  grid-template-columns: 30vw 1fr;
  height: 100%;
  overflow: hidden;
`;

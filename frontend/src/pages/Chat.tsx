import { useSelector } from "react-redux";
import styled from "styled-components";
import ChatBox from "../components/chat/ChatBox";
import ChatUsers from "../components/chat/ChatUsers";
import { getSelectedParticipant } from "../store/features/selectedParticipant";

type Props = {};

const Chat = (props: Props) => {
  const selectedUser = useSelector(getSelectedParticipant);
  return (
    <Container>
      <ChatUsers />
      {Object.keys(selectedUser).length > 1 ? (
        <ChatBox />
      ) : (
        <div style={{ color: "red" }}>select a user</div>
      )}
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

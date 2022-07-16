import {
  ReactElement,
  ReactHTMLElement,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styled, { css } from "styled-components";
import colors from "../../theme/colors.json";

import { RiSendPlaneFill as SendButton } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { getSelectedParticipant } from "../../store/features/selectedParticipant";
import {
  getMyConnection,
  getOtherConnection,
  getParticipants,
  setMyDataConnection,
  setOtherDataConnection,
} from "../../store/features/participants";
import { MeetingContext } from "../../common/meetingDetails";
import Peer, { DataConnection } from "peerjs";
import { UserContext, UserData } from "../../provider/UserProvider";
import {
  addMessageOf,
  getMessagesOf,
  Message as AppMessage,
} from "../../store/features/appMessages";
import { Socket } from "socket.io-client";

type Props = {};

type Message = {
  id: number;
  message: string;
};

const MESSAGES = [] as AppMessage[];
const ChatBox = (props: Props) => {
  const [userMessage, setUserMessage] = useState<string>("");
  const [appMessages, setAppMessages] = useState<AppMessage[]>(MESSAGES);
  // websocket connection
  const { ws }: { ws: Socket } = useContext(MeetingContext);

  // meeting participants
  const participants = useSelector(getParticipants);

  const { user }: { user: UserData } = useContext(UserContext);

  const handleSendMessage = () => {
    const message: AppMessage = {
      id: user.id,
      message: userMessage,
      time: new Date().toISOString(),
    };

    const messageDTO = {
      // * get from redux store
      roomId: "98831f68-9147-483c-aa77-737b3cbebcc9",
      message,
    };
    // emit ws event
    ws.emit("send-to-group", messageDTO);
    // add message to store
    setAppMessages((prev) => [...prev, message]);

    setUserMessage("");
  };

  // receive messages
  useEffect(() => {
    ws.emit("join-group", { roomId: "98831f68-9147-483c-aa77-737b3cbebcc9" });
    ws.on("group-message", (data) => {
      console.log("group-message", data);
      setAppMessages(data.history);
    });
  }, [ws]);

  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  const scrollToView = () => {
    if (!lastMessageRef) return;
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToView, [MESSAGES]);

  return (
    <Container>
      <Header>
        <Img src={user.photo} />
        <Name>{participants.length} participants</Name>
      </Header>
      <Body>
        {!!appMessages ? (
          appMessages.map((el, i) => {
            return (
              <MessageFlexContainer isMe={user.id === el.id}>
                <Img
                  src={
                    participants.find((participant) => participant.id == el.id)
                      ?.photo
                  }
                  size="1.5rem"
                />
                <Message key={i} isMe={user.id === el.id}>
                  {el.message}
                </Message>
              </MessageFlexContainer>
            );
          })
        ) : (
          <h3>Send a message</h3>
        )}
        <HiddenLastElement ref={lastMessageRef} />
      </Body>
      <Footer>
        <MessageForm
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <MessageInput
            value={userMessage}
            onChange={(val) => setUserMessage(val.target.value)}
          />
          <MessageButton type="submit" disabled={!userMessage}>
            <SendButton />
          </MessageButton>
        </MessageForm>
      </Footer>
    </Container>
  );
};

export default ChatBox;

const Container = styled.div`
  background-color: ${colors.theme["dark-800"]};
  display: grid;
  grid-template-rows: 60px 1fr 80px;
  height: 100vh;
  overflow: hidden;
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

const getHeightAndWidth = (size: string) => css`
  height: ${size};
  width: ${size};
`;
const Name = styled.h3``;
const Img = styled.img<{ size?: string }>`
  ${({ size }) => (size ? getHeightAndWidth(size) : getHeightAndWidth("2rem"))}

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
  overflow-y: scroll;
`;

const HiddenLastElement = styled.div`
  height: 0;
  width: 0;
  opacity: 0;
`;

interface MessageProps {
  isMe: boolean;
}

const messageBlueColor = colors.theme.message["bg-light-blue"];
const MessageBlue = css`
  background-color: ${messageBlueColor};
  border-radius: 1em 2px 1em 1em;
`;

const MessageFlexContainer = styled.div<MessageProps>`
  display: flex;
  gap: 0.5rem;

  ${({ isMe }) =>
    isMe ? " align-self: flex-end;   flex-direction: row-reverse;" : null}
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

const MessageForm = styled.form`
  display: flex;
  background-color: ${colors.theme["dark-800"]};
  gap: 0.4rem;
`;
const MessageInput = styled.input`
  flex: 1;
  height: 2rem;

  background-color: transparent;
  color: ${colors.theme["text-light-muted"]};
  border: none;
  padding: 0.3rem 1rem;
  outline: none;
  border-radius: 0.5rem;
`;
const MessageButton = styled.button`
  cursor: pointer;
  color: ${colors.theme["text-light"]};
  background-color: transparent;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.6rem;

  &:disabled {
    color: ${colors.theme["dark-400"]};
  }
`;

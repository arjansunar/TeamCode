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
  setMyDataConnection,
  setOtherDataConnection,
} from "../../store/features/participants";
import { MeetingContext } from "../../common/meetingDetails";
import Peer, { DataConnection } from "peerjs";
import { UserContext, UserData } from "../../provider/UserProvider";
import { addMessageOf, getMessagesOf } from "../../store/features/appMessages";

type Props = {};

type Message = {
  id: number;
  message: string;
};
const MESSAGES = [] as Message[];

const ChatBox = (props: Props) => {
  const [userMessage, setUserMessage] = useState<string>("");

  // selectors
  const selectedUser = useSelector(getSelectedParticipant);
  console.log(selectedUser.id);
  // const myCon = useSelector((state) => getMyConnection(state, selectedUser.id));
  // const otherUserCon = useSelector((state) =>
  //   getOtherConnection(state, selectedUser.id)
  // );

  // local connection instances
  const [myDataConnection, setMyDataConnection] = useState<DataConnection>();
  const [otherDataConnection, setOtherDataConnection] =
    useState<DataConnection>();

  // my peer instance
  const { me }: { me: Peer } = useContext(MeetingContext);
  const { user }: { user: UserData } = useContext(UserContext);

  // redux
  const dispatch = useDispatch();

  const createConnection = useCallback(() => {
    const { peerId } = selectedUser;
    // create connection
    const dataCon = me.connect(peerId, { metadata: { userId: user.id } });
    console.log("selected user: ", selectedUser.id, dataCon);
    // // save connection
    setMyDataConnection(dataCon);
  }, [selectedUser.id, me]);

  const handleSendMessage = () => {
    if (!me) return;
    if (!myDataConnection) {
      return;
    }
    if (!userMessage) return;

    myDataConnection?.send({
      id: user.id,
      message: userMessage,
      to: selectedUser.id,
    });

    dispatch(
      addMessageOf({
        of: selectedUser.id,
        messages: { id: user.id, message: userMessage },
      })
    );

    if (otherDataConnection) {
      otherDataConnection.send({
        id: user.id,
        message: userMessage,
        to: selectedUser.id,
      });
    }
    setUserMessage("");
  };

  useEffect(() => {
    createConnection();
  }, [selectedUser.id]);

  console.log({ myDataConnection, otherDataConnection });

  // setting other user connection object
  useEffect(() => {
    if (!me) return;

    me.on("connection", (dataConnection) => {
      console.log("metadata", dataConnection.metadata);
      if (dataConnection.metadata.userId === selectedUser.id) {
        console.log("another data connection ");
        setOtherDataConnection(dataConnection);
      }
    });
  }, [me, selectedUser]);
  // setting messages on receiver end
  useEffect(() => {
    if (!otherDataConnection) return;

    otherDataConnection.on("data", (data) => {
      console.log("data found", data, messagesFromRedux);
      if (data.id === selectedUser.id && data.to === user.id) {
        dispatch(addMessageOf({ of: selectedUser.id, messages: data }));
      }
    });
  }, [otherDataConnection, selectedUser, dispatch]);

  useEffect(() => {
    if (!myDataConnection) return;
    myDataConnection.on("open", () => {
      myDataConnection.on("data", (data) => {
        console.log("data mycon", data);
        if (data.id === selectedUser.id && data.to === user.id) {
          dispatch(addMessageOf({ of: selectedUser.id, messages: data }));
        }
      });
    });
  }, [myDataConnection, selectedUser, dispatch]);
  const messagesFromRedux = useSelector((state) =>
    // @ts-ignore
    getMessagesOf(state, selectedUser.id)
  );
  console.log({ messagesFromRedux });

  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  const scrollToView = () => {
    if (!lastMessageRef) return;
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToView, [messagesFromRedux]);

  return (
    <Container>
      <Header>
        <Img src={selectedUser.photo} />
        <Name>{selectedUser.username}</Name>
      </Header>
      <Body>
        {!!messagesFromRedux ? (
          messagesFromRedux.map((el, i) => {
            return (
              <Message key={i} isMe={user.id === el.id}>
                {el.message}
              </Message>
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

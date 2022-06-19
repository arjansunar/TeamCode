import { useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import styled from "styled-components";
import { VideoPlayer } from "../../components/chat/VideoPlayer";
import { RoomContext, RoomProvider } from "../../provider/RoomProvider";
import { PeerState } from "../../store/reducer/peerReducer";
import Peer, { DataConnection } from "peerjs";
// router params
import { useParams } from "react-router-dom";
import { UserContext, UserData } from "../../provider/UserProvider";
import { useSelector } from "react-redux";
import {
  getMyConnection,
  getParticipants,
} from "../../store/features/participants";
import { MeetingContext } from "../../common/meetingDetails";
import { useCookies } from "react-cookie";

type Props = {
  roomId: string;
};
const Room = () => {
  const { roomId } = useParams();
  return (
    <div>
      <RoomProvider>
        {" "}
        <DebugText>{roomId}</DebugText>
        <br />
        {/* peers */}
        <DebugText>
          <ShowPeersDetails />
          <br />
          {/* messages */}
        </DebugText>
        <br />
        <JoinMeeting />
        <br />
        <Messages />
      </RoomProvider>
    </div>
  );
};

const Messages = () => {
  const { me }: { me: Peer } = useContext(MeetingContext);
  const { user }: { user: UserData } = useContext(UserContext);
  const [to, setTo] = useState<string>("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const [myDataConnection, setMyDataConnection] = useState<DataConnection>();
  const [otherDataConnection, setOtherDataConnection] =
    useState<DataConnection>();
  const connect = () => {
    setMyDataConnection(me.connect(to));
  };
  const sendMessage = () => {
    // sending message
    if (myDataConnection) {
      myDataConnection.send({ id: user.id, message: message });
      setMessages((messages) => [...messages, message]);
    } else {
      console.log("no connection");
    }
  };

  useEffect(() => {
    if (!me) return;
    me.on("connection", (dataConnection) => {
      setOtherDataConnection(dataConnection);
    });
  }, [me]);

  useEffect(() => {
    if (!otherDataConnection) return;
    otherDataConnection.on("data", (data) => {
      setMessages((messages) => [...messages, data]);
    });
  }, [otherDataConnection]);

  console.log(myDataConnection?.connectionId);

  // console.log({ message, dataConnection: myDataConnection });
  return (
    <DebugText>
      <label>call </label>
      <input type="text" value={to} onChange={(e) => setTo(e.target.value)} />
      <label>message</label>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={connect}>connect</button>
      <button onClick={sendMessage}>Send</button>

      {messages.length > 0 && (
        <div className="div">
          <h2>messages</h2>
          <pre>{JSON.stringify(messages, null, 2)}</pre>
        </div>
      )}
    </DebugText>
  );
};
const ShowPeersDetails = () => {
  const participants = useSelector(getParticipants);
  return (
    <div>
      {!participants ? (
        <div>No participants</div>
      ) : (
        <div className="">
          <div>
            <pre>{JSON.stringify(participants, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

// components

const VideoWrapper = () => {
  const {
    peers,
    me,
    audioStream,
  }: { peers: PeerState; me: Peer; audioStream: MediaStream } =
    useContext(RoomContext);
  peers;
  if (!peers || !me) return <div>no users</div>;

  const otherUsers = Object.keys(peers).filter((ids) => ids !== me.id);
  console.table(otherUsers);
  console.log(me.id);
  return (
    <div>
      <VideoPlayer stream={audioStream} />
      {peers
        ? otherUsers.map((peerId, index) => {
            return <VideoPlayer stream={peers[peerId].stream} key={index} />;
          })
        : null}
    </div>
  );
};

const JoinMeeting = () => {
  const { user }: { user: UserData } = useContext(UserContext);
  // const [cookie, setCookie] = useCookies(["meeting-joined"]);

  const { me, ws } = useContext(MeetingContext);

  const [roomId, setRoomId] = useState("");

  const room = "98831f68-9147-483c-aa77-737b3cbebcc9";

  const clickHandler = () => {
    if (!Object.keys(me).includes("_id")) {
      console.log("no peer created yet!!");
      return;
    }
    if (roomId.length < 1) return;
    // @ts-ignore
    ws.emit("join-room", { room, peerId: me._id });
    ws.emit("update-user-peer-id", {
      // @ts-ignore
      peerId: me._id,
      userId: user.id,
      roomId: room,
    });
  };

  const joinDefaultRoom = () => {
    if (!me) return;

    // if (cookie["meeting-joined"]) {
    //   console.log("meeting already joined");
    //   return;
    // }

    // setCookie("meeting-joined", true);

    // if (!Object.keys(me).includes("_id")) {
    //   console.log("no peer created yet!!");
    //   return;
    // }
    // @ts-ignore
    ws.emit("join-room", { roomId: room, peerId: me._id });
    ws.emit("update-user-peer-id", {
      // @ts-ignore
      peerId: me._id,
      userId: user.id,
      roomId: room,
    });
  };

  useEffect(joinDefaultRoom, [me, ws]);

  return (
    <DebugText className="">
      <input
        type="text"
        placeholder="room id"
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button onClick={clickHandler}>join</button>
      <br />
    </DebugText>
  );
};

const DebugText = styled.div`
  color: black;
`;

export default Room;

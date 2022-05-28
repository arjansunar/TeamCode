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
  const { me }: { me: Peer } = useContext(RoomContext);
  const [to, setTo] = useState<string>("");
  const [message, setMessage] = useState("");
  const [condata, setcondata] = useState();
  const [messages, setMessages] = useState<string[]>([]);

  let dataConnection: DataConnection;
  const connect = () => {
    dataConnection = me.connect(to);
    console.log({ dataConnection });
  };
  const sendMessage = () => {
    me.connect(to);
    // sending message
    dataConnection.send(message);
  };

  useEffect(() => {
    if (dataConnection)
      dataConnection.on("data", (data) => {
        setcondata(data);
      });
  });

  console.log({ message });
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

      {condata && (
        <div className="div">
          <h2>messages</h2>
          <pre>{JSON.stringify(condata, null, 2)}</pre>
        </div>
      )}
    </DebugText>
  );
};
const ShowPeersDetails = () => {
  const { participants } = useContext(RoomContext);

  return (
    <div>
      {!participants ? (
        <div>No participants</div>
      ) : (
        <div>
          <pre>{JSON.stringify(participants, null, 2)}</pre>
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
  const roomId = "fc2829a2-0993-43a4-b345-f09997e3c658";
  const { ws, me }: { ws: Socket; me: any } = useContext(RoomContext);
  const { user }: { user: UserData } = useContext(UserContext);
  const clickHandler = () => {
    if (!me) {
      console.log("no peer created yet!!");
      return;
    }
    ws.emit("join-room", { roomId, peerId: me._id });
    ws.emit("update-user-peer-id", {
      peerId: me._id,
      userId: user.id,
      roomId: roomId,
    });
  };
  return (
    <DebugText className="">
      <button onClick={clickHandler}>join</button>
      <br />
    </DebugText>
  );
};

const DebugText = styled.div`
  color: black;
`;

export default Room;

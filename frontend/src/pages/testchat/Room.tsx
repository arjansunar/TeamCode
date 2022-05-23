import { useContext } from "react";
import { Socket } from "socket.io-client";
import styled from "styled-components";
import { VideoPlayer } from "../../components/chat/VideoPlayer";
import { RoomContext, RoomProvider } from "../../provider/RoomProvider";
import { PeerState } from "../../store/reducer/peerReducer";
import Peer from "peerjs";
// router params
import { useParams } from "react-router-dom";

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
        <JoinMeeting />
        <VideoWrapper />
      </RoomProvider>
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

  const clickHandler = () => {
    if (!me) {
      console.log("no peer created yet!!");
      return;
    }
    ws.emit("join-room", { roomId, peerId: me._id });
  };
  return <button onClick={clickHandler}>join</button>;
};

const DebugText = styled.div`
  color: black;
`;

export default Room;

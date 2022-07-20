import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { VideoPlayer } from "../../components/chat/VideoPlayer";
import { RoomContext, RoomProvider } from "../../provider/RoomProvider";
import { PeerState } from "../../store/reducer/peerReducer";
import Peer, { DataConnection } from "peerjs";
// router params
import { useParams } from "react-router-dom";
import { UserContext, UserData } from "../../provider/UserProvider";
import { useSelector } from "react-redux";
import { getParticipants } from "../../store/features/participants";
import { MeetingContext } from "../../common/meetingDetails";
import { useCookies } from "react-cookie";
// theme
import colors from "../../theme/colors.json";
import ChatUsers from "../../components/chat/ChatUsers";

type Props = {
  roomId: string;
};
const Room = () => {
  return (
    <Container>
      <RoomProvider>
        <JoinMeeting />
      </RoomProvider>
    </Container>
  );
};

const JoinMeeting = () => {
  const { user }: { user: UserData } = useContext(UserContext);
  const participants = useSelector(getParticipants);

  const [cookie, setCookie] = useCookies(["meetingId"]);

  const { me, ws } = useContext(MeetingContext);

  const { roomId } = useParams();
  if (!roomId) return <div>no roomId</div>;

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
      roomId: roomId,
    });
  };

  const joinDefaultRoom = () => {
    if (!me) return;
    if (!roomId) return;
    // @ts-ignore
    ws.emit("join-room", { roomId: roomId, peerId: me._id });
    setCookie("meetingId", roomId, { path: "/", maxAge: 60 * 60 * 24 });
    ws.emit("update-user-peer-id", {
      // @ts-ignore
      peerId: me._id,
      userId: user.id,
      roomId: roomId,
    });
  };

  useEffect(joinDefaultRoom, [me, ws]);

  return (
    <JoinContainer className="">
      <Title>Other users in meeting ({participants.length - 1})</Title>
      <ChatUsers />
    </JoinContainer>
  );
};

const Title = styled.h1`
  font-size: large;
  color: ${colors.theme["text-light-muted"]};
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
`;
const JoinContainer = styled.div`
  width: 30rem;
`;
const Container = styled.div`
  background-color: ${colors.theme["dark-800"]};
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
`;

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

const DebugText = styled.div`
  color: black;
`;

export default Room;

import Peer from "peerjs";
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import styled from "styled-components";
import { MeetingContext } from "../common/meetingDetails";
import { VideoPlayer } from "../components/chat/VideoPlayer";
import { RoomContext, RoomProvider } from "../provider/RoomProvider";
import { UserContext, UserData } from "../provider/UserProvider";
import { PeerState } from "../store/reducer/peerReducer";
import colors from "../theme/colors.json";

type Props = {};

const VideoChat = (props: Props) => {
  const { meetingId } = useParams();
  const { me, ws }: { me: Peer; ws: Socket } = useContext(MeetingContext);
  const { user }: { user: UserData } = useContext(UserContext);

  const joinRoom = () => {
    if (!me) return;
    if (!meetingId) return;
    // @ts-ignore
    ws.emit("join-room", { roomId: meetingId, peerId: me._id });
    ws.emit("update-user-peer-id", {
      // @ts-ignore
      peerId: me._id,
      userId: user.id,
      roomId: meetingId,
    });
  };

  //   join a room
  useEffect(joinRoom, [me, ws]);

  return (
    <RoomProvider>
      <Container>
        <VideoWrapper />
      </Container>
    </RoomProvider>
  );
};

export default VideoChat;

const VideoWrapper = () => {
  const { me }: { me: Peer } = useContext(MeetingContext);
  const { peers, stream }: { peers: PeerState; me: Peer; stream: MediaStream } =
    useContext(RoomContext);
  peers;

  if (!peers || !me) return <div>no users</div>;

  const otherUsers = Object.keys(peers).filter((ids) => ids !== me.id);
  console.table(otherUsers);

  return (
    <div>
      <VideoPlayer stream={stream} />
      {peers
        ? otherUsers.map((peerId, index) => {
            return <VideoPlayer stream={peers[peerId].stream} key={index} />;
          })
        : null}
    </div>
  );
};

const Container = styled.div`
  background-color: ${colors.theme["dark-500"]};
  height: 100vh;
  overflow-y: scroll;
  overflow-x: hidden;
`;

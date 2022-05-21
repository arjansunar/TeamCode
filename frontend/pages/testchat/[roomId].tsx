import React, { ReactElement, useContext } from "react";
import { Socket } from "socket.io-client";
import styled from "styled-components";
import { VideoPlayer } from "../../src/components/chat/VideoPlayer";
import { RoomContext, RoomProvider } from "../../src/provider/RoomProvider";

type Props = {
  roomId: string;
};

const RoomId = ({ roomId }) => {
  return (
    <RoomProvider>
      {" "}
      <DebugText>{roomId}</DebugText>
      <JoinMeeting />
      <VideoWrapper />
    </RoomProvider>
  );
};

// components

const VideoWrapper = () => {
  const { audioStream } = useContext(RoomContext);

  return <VideoPlayer stream={audioStream} />;
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
RoomId.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};

export const getServerSideProps = ({ params }) => {
  const { roomId } = params;
  return {
    props: { roomId },
  };
};

export default RoomId;

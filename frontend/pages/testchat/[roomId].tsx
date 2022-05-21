import React, { ReactElement, useContext } from "react";
import styled from "styled-components";
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
    </RoomProvider>
  );
};

// components

const JoinMeeting = () => {
  const roomId = "fc2829a2-0993-43a4-b345-f09997e3c658";
  const { ws } = useContext(RoomContext);
  const clickHandler = () => {
    ws.emit("join-room", { roomId });
    // console.log(ws);
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

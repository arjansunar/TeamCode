import dynamic from "next/dynamic";
import React, { ReactElement, useContext } from "react";
import { Socket } from "socket.io-client";
import styled from "styled-components";
import { isClient } from "../../lib/utills";
import { VideoPlayer } from "../../src/components/chat/VideoPlayer";
import { RoomContext, RoomProvider } from "../../src/provider/RoomProvider";
import { PeerState } from "../../src/store/reducer/peerReducer";

type Props = {
  roomId: string;
};

function Client({ children }) {
  const Dynamic = dynamic(async () => () => children, { ssr: false });

  return <Dynamic></Dynamic>;
}

const RoomId = ({ roomId }) => {
  return (
    <div>
      <Client>
        {isClient ? (
          <RoomProvider>
            {" "}
            <DebugText>{roomId}</DebugText>
            <JoinMeeting />
            <VideoWrapper />
          </RoomProvider>
        ) : (
          "loading"
        )}
      </Client>
    </div>
  );
};

// components

const VideoWrapper = () => {
  const { audioStream, peers } = useContext(RoomContext);
  console.log({ peers });
  return (
    <div>
      {isClient ? (
        <div>
          <VideoPlayer stream={audioStream} />
          {peers
            ? Object.values(peers as PeerState).map((peer, index) => {
                return <VideoPlayer stream={peer.stream} key={index} />;
              })
            : null}
        </div>
      ) : (
        "Loading..."
      )}
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

import { createContext, useEffect, useState } from "react";
import SocketIoClient from "socket.io-client";
import { v4 as uuidV4 } from "uuid";

const WS_URL = "http://localhost:5001";

const ws = SocketIoClient(WS_URL);
export const RoomContext = createContext<null | any>(null);

export const RoomProvider = ({ children }) => {
  // reference to the user peer "me"
  const [me, setMe] = useState<null | any>();

  // media stream
  const [audioStream, setAudioStream] = useState<MediaStream>();

  useEffect(() => {
    import("peerjs").then(({ default: Peer }) => {
      const userId = uuidV4();
      const userPeer = new Peer(userId);

      setMe(userPeer);

      ws.on("user-disconnect", ({ peerId }) => console.log("left:", peerId));

      const getUsers = ({ participants }) => {
        console.log({ participants });
      };
      ws.on("get-users", getUsers);

      try {
        navigator.mediaDevices
          .getUserMedia({ audio: true, video: true })
          .then((stream) => setAudioStream(stream));
      } catch (err) {
        console.error(err);
      }
    });
  }, []);

  useEffect(() => {
    if (!me || !audioStream) return;
    // initiation
    ws.on("user-joined", ({ peerId }) => {
      const myId = me._id;
      console.log({ peerId, myId });
      // const call = me.call(peerId, audioStream);
    });
    // answer
    me.on("call", (call) => {
      // call.answer(audioStream);
    });
  }, [me, audioStream]);
  return (
    <RoomContext.Provider value={{ ws, me, audioStream }}>
      {children}
    </RoomContext.Provider>
  );
};

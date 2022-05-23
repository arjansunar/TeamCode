import {
  createContext,
  FC,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from "react";
import SocketIoClient from "socket.io-client";
import { v4 as uuidV4 } from "uuid";
import {
  addPeerStreamAction,
  removePeerStreamAction,
} from "../store/actions/peerActions";
import Peer from "peerjs";
import { peersReducer } from "../store/reducer/peerReducer";

const WS_URL = "http://localhost:5001";

const ws = SocketIoClient(WS_URL);
export const RoomContext = createContext<null | any>(null);

interface Props {
  children: ReactNode;
}
export const RoomProvider: FC<Props> = ({ children }) => {
  // reference to the user peer "me"
  const [me, setMe] = useState<null | Peer>();

  // reducers for working with peer
  const [peers, dispatch] = useReducer(peersReducer, {});

  // media stream
  const [audioStream, setAudioStream] = useState<MediaStream>();

  useEffect(() => {
    import("peerjs").then(({ default: Peer }) => {
      const userId = uuidV4();
      const userPeer = new Peer(userId, {
        host: "localhost",
        port: 9000,
        path: "/teamCode",
      });

      setMe(userPeer);

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
      const call = me.call(peerId, audioStream);
      if (!call) return;
      call.on("stream", (peerStream) =>
        dispatch(addPeerStreamAction(peerId, peerStream))
      );
    });
    // answer
    me.on("call", (call) => {
      call.answer(audioStream);
      call.on("stream", (peerStream) =>
        dispatch(addPeerStreamAction(call.peer, peerStream))
      );
    });

    ws.on("user-disconnect", ({ peerId }) => {
      console.log("user disconnected ");
      dispatch(removePeerStreamAction(peerId));
    });
  }, [me, audioStream]);

  return (
    <RoomContext.Provider value={{ ws, me, audioStream, peers }}>
      {children}
    </RoomContext.Provider>
  );
};

import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { Socket } from "socket.io-client";
import {
  addPeerStreamAction,
  removePeerStreamAction,
} from "../store/actions/peerActions";
import Peer, { MediaConnection } from "peerjs";
import { peersReducer } from "../store/reducer/peerReducer";
import { useDispatch } from "react-redux";
import { MeetingContext } from "../common/meetingDetails";

// add bearer token
const socketOptions = {
  transportOptions: {
    polling: {
      extraHeaders: {
        Authorization: "your token", //'Bearer h93t4293t49jt34j9rferek...'
      },
    },
  },
};

interface RoomContextProps {}
export const RoomContext = createContext<null | any>(null);

interface Props {
  children: ReactNode;
}
export const RoomProvider: FC<Props> = ({ children }) => {
  // reference to the user peer "me"

  const { me, ws }: { me: Peer; ws: Socket } = useContext(MeetingContext);
  // reducers for working with peer
  const [peers, dispatch] = useReducer(peersReducer, {});

  // media stream
  const [stream, setStream] = useState<MediaStream>();

  // call users on joining room
  const callUsers = ({ peerId }: { peerId: string }) => {
    if (!stream) return;
    const call = me.call(peerId, stream);
    if (!call) return;
    call.on("stream", (peerStream: MediaStream) =>
      dispatch(addPeerStreamAction(peerId, peerStream))
    );
  };
  // answer to upcoming call request
  const answer = (call: MediaConnection) => {
    if (!stream) return;
    call.answer(stream);
    call.on("stream", (peerStream) =>
      dispatch(addPeerStreamAction(call.peer, peerStream))
    );
  };

  const handleDisconnect = ({ peerId }: { peerId: string }) => {
    // console.log("user disconnected ", peerId, peers);
    dispatch(removePeerStreamAction(peerId));
  };

  useEffect(() => {
    if (!me || !stream) return;
    // initiation
    ws.on("user-joined", callUsers);

    // answer
    me.on("call", answer);

    ws.on("user-disconnect", handleDisconnect);

    return () => {
      ws.off("user-joined");
      ws.off("user-disconnect");
    };
  }, [me, stream]);

  useEffect(() => {
    try {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setStream(stream);
        });
    } catch (error) {
      console.log("video not started");
    }
  }, []);

  return (
    <RoomContext.Provider value={{ peers, stream }}>
      {children}
    </RoomContext.Provider>
  );
};

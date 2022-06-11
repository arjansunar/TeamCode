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
import { useDispatch } from "react-redux";
import { addParticipants } from "../store/features/participants";

const WS_URL = "http://localhost:5001";

const ws = SocketIoClient(WS_URL);

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

  // meeting participants
  const [participants, setParticipants] = useState<null | any>();

  // redux wrapper
  const reduxDispatch = useDispatch();

  useEffect(() => {
    const userId = uuidV4();
    const userPeer = new Peer(
      userId
      //   {
      //   host: "localhost",
      //   port: 9000,
      //   path: "/teamCode",
      // }
    );

    setMe(userPeer);

    // getting user media
    // try {
    //   navigator.mediaDevices
    //     .getUserMedia({ audio: true, video: true })
    //     .then((stream) => setAudioStream(stream));
    // } catch (err) {
    //   console.error(err);
    // }
  }, []);

  useEffect(() => {
    const getUsers = ({
      participants,
      me,
    }: {
      participants: { participants: [] };
      me: any;
    }) => {
      reduxDispatch(addParticipants(participants));
      setParticipants({ participants, me });
      console.log({ participants });
    };
    ws.on("get-users", getUsers);
  }, [ws]);

  // useEffect(() => {
  //   if (!me || !audioStream) return;
  //   // initiation
  //   ws.on("user-joined", ({ peerId }) => {
  //     const call = me.call(peerId, audioStream);
  //     if (!call) return;
  //     call.on("stream", (peerStream) =>
  //       dispatch(addPeerStreamAction(peerId, peerStream))
  //     );
  //   });
  //   // answer
  //   me.on("call", (call) => {
  //     call.answer(audioStream);
  //     call.on("stream", (peerStream) =>
  //       dispatch(addPeerStreamAction(call.peer, peerStream))
  //     );
  //   });

  //   ws.on("user-disconnect", ({ peerId }) => {
  //     // console.log("user disconnected ", peerId, peers);
  //     dispatch(removePeerStreamAction(peerId));
  //   });
  // }, [me, audioStream]);

  return (
    <RoomContext.Provider value={{ ws, me, participants }}>
      {children}
    </RoomContext.Provider>
  );
};

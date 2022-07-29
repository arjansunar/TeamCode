import Peer from "peerjs";
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import SocketIoClient, { Socket } from "socket.io-client";

import { v4 as uuidV4 } from "uuid";
import { addParticipants } from "../store/features/participants";

const WS_URL = "http://localhost:5001";

export const MeetingContext = createContext<any | null>(null);

export const MeetingProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [me, setMe] = useState<Peer>();

  const [cookie, setCookie, removeCookie] = useCookies(["meetingId"]);

  const dispatch = useDispatch();
  useEffect(() => {
    const userId = uuidV4();
    const peer = new Peer(userId);
    setMe(peer);
  }, []);

  const [ws] = useState(SocketIoClient(WS_URL));
  // handle get-users event
  const getUsers = ({
    participants,
    me,
  }: {
    participants: { participants: [] };
    me: any;
  }) => {
    console.log("with in events");
    dispatch(addParticipants(participants));
  };

  useEffect(() => {
    ws.on("get-users", getUsers);
    ws.on("disconnect", () => {
      console.log("disconnected");
      // setCookie("meetingId", "");
    });
    ws.on("group-disconnect", () => {
      setCookie("meetingId", "");
      removeCookie("meetingId");
    });
  }, [ws]);

  return (
    <MeetingContext.Provider value={{ ws, me }}>
      {children}
    </MeetingContext.Provider>
  );
};

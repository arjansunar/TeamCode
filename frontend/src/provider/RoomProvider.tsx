import { createContext } from "react";
import SocketIoClient from "socket.io-client";

const WS_URL = "http://localhost:5001";

const ws = SocketIoClient(WS_URL);
export const RoomContext = createContext<null | any>(null);

export const RoomProvider = ({ children }) => (
  <RoomContext.Provider value={{ ws }}>{children}</RoomContext.Provider>
);

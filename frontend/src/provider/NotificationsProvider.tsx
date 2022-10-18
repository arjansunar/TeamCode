import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useCookies } from "react-cookie";
import { Socket } from "socket.io-client";
import { MeetingContext } from "../common/meetingDetails";
import { UserContext, UserData } from "./UserProvider";

import { v4 as uuid } from "uuid";

export interface Notification {
  id: string;
  message: string;
  link: string;
  userId: number;
}

interface NotificationContextProps {
  notifications: Notification[];
  setNotifications?: React.Dispatch<React.SetStateAction<Notification[]>>;
}
const NotificationContext = createContext<NotificationContextProps>({
  notifications: [],
});

const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user }: { user: UserData } = useContext(UserContext);
  const { ws }: { ws: Socket } = useContext(MeetingContext);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [cookie, setCookie, removeCookie] = useCookies([
    "meetingId",
    "meetingOwner",
  ]);
  useEffect(() => {
    const { meetingId, meetingOwner } = cookie;
    if (!meetingId || !meetingOwner || meetingOwner != user.id || !ws) {
      console.log("not auth");
    }
    console.log("hello notify ");
    ws.on("notification-teach", (data) => {
      const { message, link, userId }: Notification = data;

      console.log("notification", { message, link, userId });
      setNotifications((prev) => [
        ...prev,
        { message, link, userId, id: uuid() },
      ]);
    });
  }, [ws, cookie]);

  console.log({ notifications });

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export { NotificationContext, NotificationProvider };

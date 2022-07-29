import { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Socket } from "socket.io-client";
import { MeetingContext } from "../common/meetingDetails";
import { NotificationContext } from "../provider/NotificationsProvider";
import { UserContext, UserData } from "../provider/UserProvider";

type Props = {};

const Notification = (props: Props) => {
  const data = useContext(NotificationContext);
  return (
    <pre style={{ color: "black" }}>
      {JSON.stringify(data?.notifications, null, 2)}
    </pre>
  );
};

export default Notification;

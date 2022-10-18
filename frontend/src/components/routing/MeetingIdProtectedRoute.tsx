import { useCookies } from "react-cookie";
import { Navigate, Outlet } from "react-router-dom";

export const MeetingIdNeeded = () => {
  const [cookie] = useCookies(["meetingId"]);
  const meetingId = cookie.meetingId;

  let key = false;

  if (!!meetingId && String(meetingId).length > 0) {
    key = true;
  }

  return key ? <Outlet /> : <Navigate to="/meeting" />;
};

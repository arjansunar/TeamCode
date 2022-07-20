import Peer from "peerjs";
import { useContext } from "react";
import { useCookies } from "react-cookie";
import { Socket } from "socket.io-client";
import styled from "styled-components";
import { MeetingContext } from "../../common/meetingDetails";
import colors from "../../theme/colors.json";
import { Btn } from "./StartRoom";

type Props = {};

export const JoinRoom = (props: Props) => {
  const { ws, me }: { ws: Socket; me: Peer } = useContext(MeetingContext);

  const [cookie, setCookie, removeTokenCookie] = useCookies([
    "token",
    "meetingId",
  ]);
  const handleLogOut = () => {
    console.log("logout");
    setCookie("token", "");
    me.destroy();
    me.disconnect();
    ws.disconnect();
    removeTokenCookie("token");
  };
  const hasMeetingId = cookie.meetingId && String(cookie.meetingId).length > 0;

  return (
    <Container>
      {hasMeetingId ? "Meeting Joined!!" : "Use Meeting Url to join meeting"}
      <Btn danger onClick={handleLogOut}>
        Log out
      </Btn>
    </Container>
  );
};

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: center;
  font-weight: bold;
  color: ${colors.theme["text-light-muted"]};
`;

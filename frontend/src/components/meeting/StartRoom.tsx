import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import colors from "../../theme/colors.json";

import { AiFillCopy as CopyIcon } from "react-icons/ai";
import { FaClipboardCheck as CopiedIcon } from "react-icons/fa";
import { UserContext, UserData } from "../../provider/UserProvider";
import { axiosTeamCode } from "../../api/hooks";
import CopyToClipboard from "react-copy-to-clipboard";
import { MeetingContext } from "../../common/meetingDetails";
import { Socket } from "socket.io-client";
import Peer from "peerjs";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { Container } from "./JoinRoom";

type Props = {};

export const StartRoom = (props: Props) => {
  const [roomId, setRoomId] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const [cookie, setCookie, removeTokenCookie] = useCookies([
    "token",
    "meetingId",
  ]);

  const { ws, me }: { ws: Socket; me: Peer } = useContext(MeetingContext);
  const { user }: { user: UserData } = useContext(UserContext);

  const { token } = useContext(UserContext);
  const navigate = useNavigate();

  const hasMeetingId = cookie.meetingId && String(cookie.meetingId).length > 0;

  useEffect(() => {
    (async () => {
      try {
        if (!token) return;
        axiosTeamCode.defaults.headers.common = {
          Authorization: `Bearer ${token}`,
        };

        const { data } = await axiosTeamCode.get("/rooms/my-room");

        const myRoomId = data?.id;

        if (!myRoomId) return;

        setRoomId(myRoomId);
        handleJoinRoom();
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const handleJoinRoom = () => {
    if (!roomId) return;

    navigate(`/room/${roomId}`);
  };

  const handleLogOut = () => {
    setCookie("token", "");
    removeTokenCookie("token");
    handleCloseRoom();
    me.destroy();
    me.disconnect();
    ws.disconnect();
  };

  const handleStartRoom = async () => {
    if (roomId) return;
    try {
      const { data } = await axiosTeamCode.post("/rooms/generate");
      if (!data?.id) return;
      setRoomId(data?.id);
      handleJoinRoom();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCloseRoom = async () => {
    if (!roomId) return;

    ws.emit("end-meeting", {
      roomId,
      userId: user.id,
    });

    setRoomId("");
  };
  return (
    <Wrapper>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleStartRoom();
        }}
      >
        <Btn type="submit" disabled={!!roomId}>
          Start room
        </Btn>
        <Btn type="button" danger onClick={handleCloseRoom} disabled={!roomId}>
          End meeting
        </Btn>
        <Btn danger onClick={handleLogOut}>
          Log out
        </Btn>
      </form>
      {roomId && (
        <CopyToClipboard
          text={`${window.location.origin}/room/${roomId}`}
          onCopy={() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 1500);
          }}
        >
          <DisplayRoomId>
            {isCopied ? <CopiedIcon /> : <CopyIcon />}
            {window.location.origin}/room/{roomId}
          </DisplayRoomId>
        </CopyToClipboard>
      )}

      {!hasMeetingId ? (
        <Container>Use the Url to join a meeting</Container>
      ) : null}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-color: ${colors.theme["dark-300"]};
  width: fit-content;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  min-width: 400px;
  min-height: fit-content;
  margin: 1rem auto 0 auto;
`;

export const Btn = styled.button<{ danger?: boolean }>`
  margin-left: 0.5rem;
  background-color: ${({ danger }) =>
    danger ? colors.theme["danger-400"] : colors.theme["bg-blue"]};
  padding: 0.5rem 0.9rem;
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  outline: none;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:disabled {
    background-color: ${colors.theme["dark-400"]};
    color: ${colors.theme["text-light-muted"]};
    cursor: not-allowed;
  }
`;

const DisplayRoomId = styled.div`
  background-color: ${colors.theme["dark-800"]};
  padding: 1rem 1.3rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.15rem;
  cursor: pointer;
`;

import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import colors from "../../theme/colors.json";

import { AiFillCopy as CopyIcon } from "react-icons/ai";
import { FaClipboardCheck as CopiedIcon } from "react-icons/fa";
import { UserContext } from "../../provider/UserProvider";
import { axiosTeamCode } from "../../api/hooks";
import { useCookies } from "react-cookie";
import CopyToClipboard from "react-copy-to-clipboard";

type Props = {};

export const StartRoom = (props: Props) => {
  const [roomId, setRoomId] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const { token } = useContext(UserContext);
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
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const handleStartRoom = async () => {
    if (roomId) return;
    try {
      const { data } = await axiosTeamCode.post("/rooms/generate");
      if (!data?.id) return;
      setRoomId(data?.id);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <Wrapper>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleStartRoom();
        }}
      >
        <Btn type="submit">Start room</Btn>
      </form>
      {roomId && (
        <CopyToClipboard
          text={roomId}
          onCopy={() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 1500);
          }}
        >
          <DisplayRoomId>
            {isCopied ? <CopiedIcon /> : <CopyIcon />}
            {roomId}
          </DisplayRoomId>
        </CopyToClipboard>
      )}
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

const Btn = styled.button`
  background-color: ${colors.theme["bg-blue"]};
  padding: 0.5rem 0.9rem;
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  outline: none;
  border: none;
  border-radius: 5px;
  cursor: pointer;
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

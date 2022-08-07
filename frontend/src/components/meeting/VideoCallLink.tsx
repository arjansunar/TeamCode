import { useCookies } from "react-cookie";
import styled from "styled-components";

import colors from "../../theme/colors.json";
import { DisplayRoomId } from "./StartRoom";

import { FiExternalLink as LinkIcon } from "react-icons/fi";

type Props = {};

export const VideoCallLink = (props: Props) => {
  const [cookie] = useCookies(["meetingId"]);
  const hasMeetingId = cookie.meetingId && String(cookie.meetingId).length > 0;

  const videoLink = hasMeetingId
    ? `${window.location.origin}/video/${cookie.meetingId}vid`
    : "";

  return (
    <div>
      {hasMeetingId ? (
        <Container>
          <Title>Use the link below to Get into a video call</Title>
          <FlexContainer>
            <DisplayRoomId>
              {videoLink.substring(0, 50)}...
              <Link href={videoLink} target="_blank" rel="noopener noreferrer">
                <LinkIcon />
              </Link>
            </DisplayRoomId>
          </FlexContainer>
        </Container>
      ) : null}
    </div>
  );
};

const Container = styled.div`
  background-color: ${colors.theme["dark-300"]};
  margin: 2rem auto;
  padding: 1.5rem 1rem;
  width: fit-content;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.div`
  text-align: center;
  font-size: 1.4rem;
  font-style: oblique;
  font-weight: 600;
`;

const Link = styled.a`
  color: ${colors.theme["text-light"]};
  text-decoration: none;
`;

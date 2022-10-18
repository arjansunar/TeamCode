import { useContext } from "react";
import styled from "styled-components";
import { UserContext, UserData } from "../provider/UserProvider";
import colors from "../theme/colors.json";

// icons
import {
  FaChalkboardTeacher as TeacherIcon,
  FaUserAlt as StudentIcon,
} from "react-icons/fa";

import { IoMdMail as MailIcon } from "react-icons/io";
import { JoinRoom, StartRoom, VideoCallLink } from "../components/meeting";

type Props = {};

const Meeting = (props: Props) => {
  const { user }: { user: UserData } = useContext(UserContext);

  const isTeacher = user.role === "TEACHER";

  return (
    <MeetingWrapper>
      {user && user.photo && (
        <UserInfoContainer>
          <UserInfoWrapper>
            <UserProfilePic src={user.photo} alt={user.username} />
            <UserInfo>
              <UserName>{user.username}</UserName>
              <Divider />
              <UserInfoRow>
                {isTeacher ? <TeacherIcon /> : <StudentIcon />}
                {user.role}
              </UserInfoRow>
              <Divider />
              <UserInfoRow>
                <MailIcon />
                {user.email}
              </UserInfoRow>
            </UserInfo>
            <Divider />
          </UserInfoWrapper>
        </UserInfoContainer>
      )}

      {isTeacher ? <StartRoom /> : <JoinRoom />}

      <VideoCallLink />
    </MeetingWrapper>
  );
};

export default Meeting;

const MeetingWrapper = styled.div`
  background-color: ${colors["theme"]["dark-800"]};
  height: 100vh;
`;

const UserInfoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 3rem;
`;
const UserInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const UserProfilePic = styled.img`
  height: 7rem;
  width: 7rem;
  border-radius: 50%;
  object-fit: contain;
`;
const UserInfo = styled.div``;
const UserName = styled.div`
  margin-top: 1rem;
  text-align: center;
  font-size: x-large;
  font-weight: 700;
  font-style: italic;
`;
const UserInfoRow = styled.div`
  display: flex;

  font-size: 1.125rem;
  gap: 1rem;
  text-transform: lowercase;
`;

const Divider = styled.div`
  height: 2px;
  width: 100%;
  border-radius: 5px;
  background-color: ${colors.theme["dark-300"]};
  margin: 0.8rem 0;
`;

import { ReactElement, ReactNode, useContext } from "react";
import styled from "styled-components";
import colors from "../theme/colors.json";

import { IconType } from "react-icons";
import { BsChatLeftTextFill as ChatIcon } from "react-icons/bs";

import { AiFillCode as EditorIcon } from "react-icons/ai";

import { IoMdNotifications as NotificationIcon } from "react-icons/io";

// router
import { Link, useNavigate } from "react-router-dom";

import { UserContext, UserData } from "../provider/UserProvider";
import { NotificationContext } from "../provider/NotificationsProvider";

type Props = {
  children?: ReactNode;
};

export const LayoutSidebar = ({ children }: Props) => {
  const { user }: { user: UserData } = useContext(UserContext);
  const { notifications } = useContext(NotificationContext);

  const isTeacher = user.role === "TEACHER";

  return (
    <Layout>
      <SidebarContainer>
        <IconsContainer>
          <LinkButton route="/chat" Icon={ChatIcon} />
          <LinkButton route="/editor" Icon={EditorIcon} />
          {isTeacher ? (
            <NotifyNumber size={String(notifications.length).length}>
              <LinkButton route="/notification" Icon={NotificationIcon} />

              {notifications.length > 0 && <span>{notifications.length}</span>}
            </NotifyNumber>
          ) : null}
          {user && user.photo && (
            <Link to="/meeting">
              <UserProfile src={user.photo} alt={user.username} />
            </Link>
          )}
        </IconsContainer>
      </SidebarContainer>
      {children}
    </Layout>
  );
};

const LinkButton = ({ Icon, route }: { Icon: IconType; route: string }) => {
  const navigate = useNavigate();
  const changeRoute = () => {
    navigate(route);
  };
  return (
    <IconWrapper onClick={changeRoute}>
      <Icon />
    </IconWrapper>
  );
};

const NotifyNumber = styled.div<{ size: number }>`
  position: relative;
  margin-top: ${({ size }) => size * 0.06 + "rem"};

  span {
    box-sizing: border-box;
    --padding: 0.2rem;
    --size: ${({ size }) => size}ch;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${colors.theme["text-light"]};
    font-size: 0.7rem;
    height: calc(1.5ch + var(--padding) + var(--padding));
    padding: var(--padding);
    width: calc(var(--size) + var(--padding) + var(--padding));
    top: -${({ size }) => size * 0.3 + "rem"};
    right: -1.5ch;
    background-color: ${colors.theme.message["bg-light-blue"]};
    border-radius: 20%;
  }
`;

const SidebarContainer = styled.div`
  --padding-top: 2rem;
  height: calc(100vh);
  background-color: ${colors.theme["dark-400"]};
  padding-top: var(--padding-top);
`;
const Layout = styled.div`
  display: grid;
  grid-template-columns: 3.5rem 1fr;
  overflow: hidden;
`;

const IconsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  justify-content: center;
`;

{
  /* adds styles to the icons */
}
const IconWrapper = styled.button`
  background: none;
  padding: 0;
  border: none;
  color: ${colors.theme["text-light-muted"]};
  font-size: 1.125rem;
  cursor: pointer;
`;

const UserProfile = styled.img`
  height: 1.5rem;
  width: 1.5rem;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
`;

import { ReactNode, useContext } from "react";
import styled from "styled-components";
import colors from "../theme/colors.json";

import { IconType } from "react-icons";
import { BsChatLeftTextFill as ChatIcon } from "react-icons/bs";

import { AiFillCode as EditorIcon } from "react-icons/ai";

import { IoMdNotifications as NotificationIcon } from "react-icons/io";

// router
import { useNavigate } from "react-router-dom";
import { UserContext, UserData } from "../provider/UserProvider";
type Props = {
  children?: ReactNode;
};

export const LayoutSidebar = ({ children }: Props) => {
  const { user }: { user: UserData } = useContext(UserContext);

  return (
    <Layout>
      <SidebarContainer>
        <IconsContainer>
          <LinkButton route="/chat" Icon={ChatIcon} />
          <LinkButton route="/editor" Icon={EditorIcon} />
          <LinkButton route="/notification" Icon={NotificationIcon} />
          {user && user.photo && (
            <UserProfile src={user.photo} alt={user.username} />
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

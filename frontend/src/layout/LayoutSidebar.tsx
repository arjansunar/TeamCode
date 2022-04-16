import { ReactChild, ReactNode } from "react";
import styled from "styled-components";
import colors from "../theme/colors.json";

import { useRouter } from "next/router";
import { IconType } from "react-icons";
import {
  BsChatLeftTextFill as ChatIcon,
  // BsFillFileCodeFill as EditorIcon,
} from "react-icons/bs";

import { AiFillCode as EditorIcon } from "react-icons/ai";
type Props = {
  children?: ReactNode;
};

export const LayoutSidebar = ({ children }: Props) => {
  return (
    <Layout>
      <SidebarContainer>
        <IconsContainer>
          <LinkButton route="/chat" Icon={ChatIcon} />
          <LinkButton route="/editor" Icon={EditorIcon} />
        </IconsContainer>
      </SidebarContainer>
      {children}
    </Layout>
  );
};

const LinkButton = ({ Icon, route }: { Icon: IconType; route: string }) => {
  const router = useRouter();
  const changeRoute = () => {
    router.push(route);
  };
  return (
    <IconWrapper onClick={changeRoute}>
      <Icon />
    </IconWrapper>
  );
};

const SidebarContainer = styled.div`
  height: 100vh;
  background-color: ${colors["bg-dark"]};
  padding-top: 2rem;
`;
const Layout = styled.div`
  display: grid;
  grid-template-columns: 3.5rem 1fr;
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
  color: ${colors["bg-light"]};
  font-size: 1.125rem;
  cursor: pointer;
`;

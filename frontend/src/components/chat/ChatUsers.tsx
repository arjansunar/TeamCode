import { ChangeEvent, useContext, useState } from "react";
import styled from "styled-components";
import colors from "../../theme/colors.json";

import { BsSearch as SearchIcon } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import {
  getParticipants,
  Participant,
} from "../../store/features/participants";
import { setSelected } from "../../store/features/selectedParticipant";
import { UserContext, UserData } from "../../provider/UserProvider";

type Props = {
  selectable?: boolean;
};

const ChatUsers = ({ selectable }: Props) => {
  const participants = useSelector(getParticipants);

  // redux
  const reduxDispatch = useDispatch();

  const { user }: { user: UserData } = useContext(UserContext);

  const setSelectedParticipant = (user: Participant) => {
    if (typeof user !== "object") return;
    reduxDispatch(setSelected(user));
  };
  return (
    <Container>
      <UsersContainer hasMargin={!!participants.length}>
        {!!participants && participants.length ? (
          participants.map((el) => {
            if (el && el.id !== user.id) {
              if (selectable) {
                return (
                  <UserContainer
                    key={el.id}
                    onClick={() => setSelectedParticipant(el)}
                    selectable
                  >
                    <UserImage src={el.photo} />
                    <UserName>{el.username}</UserName>
                  </UserContainer>
                );
              }
              return (
                <UserContainer key={el.id}>
                  <UserImage src={el.photo} />
                  <UserName>{el.username}</UserName>
                </UserContainer>
              );
            }
          })
        ) : (
          <NoUsersContainer>No users joined </NoUsersContainer>
        )}
      </UsersContainer>
    </Container>
  );
};

const Container = styled.div`
  background-color: ${colors.theme["dark-500"]};
  padding: 1rem 1.5rem;
  max-height: 100vh;
  overflow: hidden;
`;

const NoUsersContainer = styled.div`
  color: ${colors.theme["text-light"]};
  min-height: 2rem;
  display: flex;
  align-items: center;
`;

interface UserContainerProps {
  hasMargin?: boolean;
}

const UsersContainer = styled.div<UserContainerProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin: ${({ hasMargin }) => (hasMargin ? "1rem auto 0 auto" : "0 auto")};
  gap: 1rem;
  overflow-y: scroll;
  height: 80%;
  max-width: 100%;
  ::-webkit-scrollbar {
    width: 0px;
  }
`;

export const UserImage = styled.img`
  height: 3rem;
  width: 3rem;
  border-radius: 0.5rem 0 0 0.5rem;
  object-fit: cover;
  object-position: center center;
`;

const UserName = styled.h4`
  font-size: 0.9rem;
  color: ${colors.theme["text-light-muted"]};
`;

const UserContainer = styled.div<{ selectable?: boolean }>`
  cursor: ${({ selectable }) => (selectable ? "pointer" : "default")};
  display: flex;
  gap: 2rem;
  width: 100%;
  align-items: center;
  background-color: ${colors.theme["dark-300"]};
  /* padding-right: 1.5rem; */
  border-radius: 0.5rem;
`;
export default ChatUsers;

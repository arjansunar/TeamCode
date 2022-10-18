import { useContext, useState } from "react";
import styled from "styled-components";
import { Btn, DisplayRoomId } from "../components/meeting";
import {
  Notification as NotificationType,
  NotificationContext,
} from "../provider/NotificationsProvider";

import colors from "../theme/colors.json";

import { AiFillCopy as CopyIcon } from "react-icons/ai";
import { FaClipboardCheck as CopiedIcon } from "react-icons/fa";
import { MdDelete as DeleteIcon } from "react-icons/md";

import CopyToClipboard from "react-copy-to-clipboard";
import { getParticipants } from "../store/features/participants";
import { useSelector } from "react-redux";
import { UserImage } from "../components/chat/ChatUsers";

type Props = {};

const Notification = (props: Props) => {
  const { notifications, setNotifications } = useContext(NotificationContext);
  const participants = useSelector(getParticipants);

  return (
    <Container>
      <TitleText>Notifications</TitleText>
      {notifications.length > 0 ? (
        <NotificationListContainer>
          {notifications.map((notificationItem) => (
            <NotificationItem
              key={notificationItem.id}
              item={notificationItem}
              photo={
                participants.find(
                  (participant) => participant.id === notificationItem.userId
                )?.photo
              }
            />
          ))}
        </NotificationListContainer>
      ) : (
        <TextContainter>
          <DisplayRoomId>No notifications</DisplayRoomId>
        </TextContainter>
      )}
    </Container>
  );
};

export default Notification;

interface NotificationItemProps {
  item: NotificationType;
  photo?: string;
}
const NotificationItem = ({ item, photo }: NotificationItemProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const { notifications, setNotifications } = useContext(NotificationContext);

  const handleDelete = ({ id }: { id: string }) => {
    if (!setNotifications) return;
    const newNotifications = notifications.filter((el) => el.id !== id);
    setNotifications(newNotifications);
  };

  return (
    <NotificationItemContainer>
      <ListBgContainer>
        <FlexContainer gap="2rem">
          <UserImage src={photo} alt="" />
          <SubTitleText>{item.message}</SubTitleText>
        </FlexContainer>
        <CopyToClipboard
          text={item.link}
          onCopy={() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 1500);
          }}
        >
          <FlexContainer>
            <LinkText>
              {isCopied ? <CopiedIcon /> : <CopyIcon />}
              {item.link.substring(0, 60)}...
            </LinkText>
            <NotificationBtnContainer>
              <Btn danger onClick={() => handleDelete({ id: item.id })}>
                <DeleteIcon />
              </Btn>
            </NotificationBtnContainer>
          </FlexContainer>
        </CopyToClipboard>
      </ListBgContainer>
    </NotificationItemContainer>
  );
};

const ListBgContainer = styled.div`
  background-color: ${colors.theme["dark-400"]};
  padding: 1rem;
  border-radius: 0.5rem;
`;
const Container = styled.div`
  background-color: ${colors["bg-dark"]};
  min-height: 100vh;
  width: 100vw;
`;

const LinkText = styled(DisplayRoomId)`
  text-overflow: ellipsis;
  min-height: 4ch;
`;

interface FlexContainerProps {
  gap?: string;
}
const FlexContainer = styled.div<FlexContainerProps>`
  display: flex;
  align-items: center;
  gap: ${({ gap }) => gap || "0rem"};
  /* justify-content: center; */
`;

const TitleText = styled.h2`
  font-weight: 700;
  font-style: italic;
  text-transform: uppercase;
  margin-bottom: 2rem;
  text-align: center;
  font-size: x-large;
  margin-top: 2rem;
`;

const SubTitleText = styled(TitleText)`
  font-size: large;
  text-align: unset;
`;

const NotificationListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  max-width: fit-content;
  padding: 2rem 1.5rem;
  border-radius: 0.5rem;
  margin: 0 auto;
  background-color: ${colors.theme["dark-500"]};
`;

const NotificationItemContainer = styled.div``;

const NotificationBtnContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TextContainter = styled.div`
  max-width: 50%;
  margin: 0 auto;
`;

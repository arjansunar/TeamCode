import styled from "styled-components";
import colors from "../../theme/colors.json";

type Props = {};

const users = [
  {
    name: "Arjan Sunar",
    image: "https://avatars.githubusercontent.com/u/55121485?v=4",
  },
  {
    name: "Aaka Sunar",
    image: "https://avatars.githubusercontent.com/u/55166361?v=4",
  },
  {
    name: "Daaka Sunar",
    image:
      "https://images.unsplash.com/photo-1474978528675-4a50a4508dc3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
  },
];

const ChatUsers = (props: Props) => {
  return (
    <Container>
      <SearchBar placeholder="Search User" />
      <UsersContainer>
        {!!users ? (
          users?.map((el, i) => (
            <UserContainer key={i}>
              <UserImage src={el.image} />
              <UserName>{el.name}</UserName>
            </UserContainer>
          ))
        ) : (
          <h4>No users joined </h4>
        )}
      </UsersContainer>
    </Container>
  );
};

const Container = styled.div`
  background-color: ${colors.theme["dark-500"]};
  padding: 1rem 1.5rem;
`;

const SearchBar = styled.input`
  background-color: ${colors.theme["dark-800"]};
  color: ${colors.theme["text-light"]};
  border: none;
  padding: 0.8rem 1.5rem;
  outline: none;
  border-radius: 0.3rem;
`;

const UsersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 2rem 0;
  gap: 1rem;
`;

const UserImage = styled.img`
  height: 3rem;
  width: 3rem;
  border-radius: 20% 0 0 20%;
  object-fit: cover;
  object-position: center center;
`;

const UserName = styled.h4`
  font-size: 0.9rem;
  color: ${colors.theme["text-light-muted"]};
`;

const UserContainer = styled.div`
  display: flex;
  gap: 2rem;
  width: 100%;
  align-items: center;
  background-color: ${colors.theme["dark-300"]};
  padding-right: 1.5rem;
  border-radius: 0.7rem;
`;
export default ChatUsers;

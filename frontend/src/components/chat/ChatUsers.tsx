import { ChangeEvent, useState } from "react";
import styled from "styled-components";
import colors from "../../theme/colors.json";

import { BsSearch as SearchIcon } from "react-icons/bs";

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
  const [searchUser, setSearchUser] = useState("");
  const handleSearchChange = (val: ChangeEvent) => {
    // @ts-ignore
    const searchText = val.target.value;
    if (!searchText) return;
    setSearchUser(searchText);
  };

  const handleSearchSubmit = () => {
    console.log({ searchUser });
  };
  console.log({ searchUser });
  return (
    <Container>
      <SearchWrapper onSubmit={(e) => e.preventDefault()}>
        <SearchBar
          placeholder="Search User"
          value={searchUser}
          onChange={(e) => handleSearchChange(e)}
        />
        <SearchButton onClick={handleSearchSubmit}>
          <SearchIcon />
        </SearchButton>
      </SearchWrapper>
      <UsersContainer>
        {!!users ? (
          users?.map((el, i) => (
            <UserContainer key={i + el.name}>
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
  max-height: 100vh;
  overflow: hidden;
`;

const SearchBar = styled.input`
  background-color: ${colors.theme["dark-800"]};
  color: ${colors.theme["text-light-muted"]};
  border: none;
  padding: 0.8rem 1.5rem;
  outline: none;
  border-radius: 0.5rem;
  width: 100%;
`;
const SearchWrapper = styled.form`
  display: flex;
  background-color: ${colors.theme["dark-800"]};
`;

const SearchButton = styled.button`
  color: ${colors.theme["text-light"]};
  background-color: ${colors.theme["dark-400"]};
  padding: 0 0.6rem;
  outline: none;
  border: none;
  display: flex;
  place-items: center;
  border-radius: 0 0.5rem 0.5rem 0;
`;

const UsersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin: 2rem auto 0 auto;
  gap: 1rem;
  overflow-y: scroll;
  height: 80%;
  max-width: 100%;
  ::-webkit-scrollbar {
    width: 0px;
  }
`;

const UserImage = styled.img`
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

const UserContainer = styled.div`
  display: flex;
  gap: 2rem;
  width: 100%;
  align-items: center;
  background-color: ${colors.theme["dark-300"]};
  /* padding-right: 1.5rem; */
  border-radius: 0.5rem;
`;
export default ChatUsers;

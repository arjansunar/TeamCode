import { Container, Flex } from "@chakra-ui/react";
import MessageBoard from "./MessageBoard";
import Sidebar from "./Sidebar";
import UsersChat from "./UsersChat";
import { Grid, GridItem } from "@chakra-ui/react";

const Chat = () => {
  return (
    <Container maxW="full" p={0}>
      <Grid templateColumns="80px 1fr 2.5fr" gap={0}>
        <GridItem w="100%" h="100vh" bg="blue.500">
          <Sidebar />
        </GridItem>
        <GridItem w="100%" h="100vh" bg="blue.500">
          <UsersChat />
        </GridItem>
        <GridItem w="100%" h="100vh" bg="blue.500">
          <MessageBoard />
        </GridItem>
      </Grid>
    </Container>
  );
};

export default Chat;

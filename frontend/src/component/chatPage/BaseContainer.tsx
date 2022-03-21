import { FC } from "react";
import { Container } from "@chakra-ui/react";

interface props {
  br?: string;
  bt?: string;
  bb?: string;
  bl?: string;
}
const BaseContainer: FC<props> = ({ children, br, bt, bb, bl }) => {
  return (
    <Container
      maxW="full"
      w="full"
      h="full"
      p="0"
      bg="brand.900"
      color="white"
      borderRight={br ? br : "1px"}
      borderLeft={bl ? bl : "0px"}
      borderTop={bt ? bt : "0px"}
      borderBottom={bb ? bb : "0px"}
      borderColor="brand.600"
    >
      {children}
    </Container>
  );
};

export default BaseContainer;

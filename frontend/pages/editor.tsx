import dynamic from "next/dynamic";
import React from "react";
import styled from "styled-components";
import { useAxios } from "../src/api/hooks";
/* components */
import { OutputScreen } from "../src/components";
import colors from "../src/theme/colors.json";
const AceEditor = dynamic(import("../src/components/AceEditor"), {
  ssr: false,
});
type Props = {};

const editor = (props: Props) => {
  // const { error, loading, response } = useAxios({
  //   url: "/about",
  //   method: "get",
  // });
  // console.log({ response });

  return (
    <Container>
      <SettingsWrapper>
        <Button>Run </Button>
      </SettingsWrapper>
      <AceEditor />
      <OutputScreen />
    </Container>
  );
};

const Container = styled.main`
  display: grid;
  grid-template-rows: 5vh 65vh 1fr;
`;

const SettingsWrapper = styled.div`
  background-color: ${colors["bg-dark"]};
  height: 100%;
`;

const Button = styled.button`
  background-color: #4a99de;
  border: none;
  font-size: 16px;
  padding: 8px 18px;
  color: ${colors["bg-light"]};
  border-radius: 0.2rem;
  cursor: pointer;
`;
export default editor;

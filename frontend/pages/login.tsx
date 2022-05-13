import React, { ReactElement, useEffect } from "react";
import styled from "styled-components";
// theme
import colors from "./../src/theme/colors.json";
// icon
import { GoMarkGithub as GitHubIcon } from "react-icons/go";
import axios from "axios";
import { useRouter } from "next/router";
import { setCookie } from "nookies";

type Props = {};

function Login({}: Props) {
  // const { query: queryParams } = useRouter();

  // const authData = [queryParams.auth_data].join();
  // console.log({ authData });
  // setCookie(null, "auth_data", authData);

  const handleLoginWithGithub = () => {
    window.open("http://127.0.0.1:5000/auth/", "_self");
  };

  return (
    <Container>
      <LoginFormContainer>
        <LoginText>Get Started with TeamCode</LoginText>
        <RoleWrapper>
          <RoleLabel htmlFor="role">I am a </RoleLabel>
          <RoleSelect name="role" id="role">
            <option value="STUDENT">Student</option>
            <option value="TEACHER">Teacher</option>
          </RoleSelect>
        </RoleWrapper>
        <LoginGitHubButton>
          <LoginTextWrapper onClick={handleLoginWithGithub}>
            Login With GitHub
          </LoginTextWrapper>
          <GitHubIcon />
        </LoginGitHubButton>
        <NextButton>Next</NextButton>
      </LoginFormContainer>
    </Container>
  );
}

Login.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};

export default Login;

const Container = styled.main`
  height: 100vh;
  background-color: ${colors["bg-dark"]};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginFormContainer = styled.div`
  position: relative;
  background-color: ${colors.theme["dark-300"]};
  padding: 3rem 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const LoginText = styled.h2`
  font-weight: 700;
  font-style: italic;
  text-transform: uppercase;
  margin-bottom: 2rem;
`;

const RoleWrapper = styled.div`
  display: flex;
  gap: 0.4rem;
  margin-bottom: 1rem;
`;

const RoleLabel = styled.label`
  font-size: 1.05rem;
`;

const RoleSelect = styled.select`
  background-color: ${colors.theme["dark-400"]};
  color: ${colors.theme["text-light"]};
`;

const LoginGitHubButton = styled.button`
  padding: 0.4rem 0.8rem;
  background-color: ${colors.theme["github-green-45"]};
  outline: none;
  border: none;
  border-radius: 0.3rem;
  color: ${colors.theme["text-light"]};
  display: flex;
  align-items: flex-start;
  justify-content: center;

  &:hover {
    background-color: ${colors.theme["github-green-50"]};
  }
`;

const NextButton = styled.button`
  padding: 0.4rem 0.8rem;

  border: none;
  outline: none;
  position: absolute;
  color: ${colors.theme["github-green-50"]};
  border-radius: 0.2rem;

  right: 0.8rem;
  bottom: 0.5rem;

  background-color: transparent;

  &:hover {
    color: ${colors.theme["github-green-60"]};
  }

  &[disabled="disabled"],
  &:disabled {
    color: gray;
    background-color: transparent;
  }
`;

const LoginTextWrapper = styled.span`
  margin-right: 0.3rem;
  font-weight: 600;
`;

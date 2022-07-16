import styled from "styled-components";
// theme
import colors from "../theme/colors.json";
// icon
import { GoMarkGithub as GitHubIcon } from "react-icons/go";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { axiosTeamCode } from "../api/hooks";

type Props = {};

type Role = "STUDENT" | "TEACHER";

interface AuthData {
  user: {};
  access_token: string;
}

const SERVER_IP = "http://localhost:5000/auth/";
function Login({}: Props) {
  const handleLoginWithGithub = () => {
    window.open(SERVER_IP, "_self");
  };

  const [searchParams] = useSearchParams();
  const [cookies, setCookie] = useCookies(["user_data", "token"]);
  const [role, setRole] = useState<Role>("STUDENT");

  const navigate = useNavigate();
  useEffect(() => {
    const auth_data = searchParams.get("auth_data");
    if (!auth_data) return;
    const parsed_auth_data: AuthData = JSON.parse(auth_data);
    const token = parsed_auth_data.access_token;
    const user = parsed_auth_data.user;
    if (!token || !user) return;

    setCookie("user_data", user);
    setCookie("token", token);
  }, [searchParams]);

  useEffect(() => {
    const token = cookies.token;
    if (!token) return;
    axiosTeamCode.defaults.headers.common = {
      Authorization: `Bearer ${token}`,
    };
  }, [cookies]);

  const handleRoleSelection = async () => {
    try {
      const { data, status } = await axiosTeamCode.post(`/users/role`, {
        role,
      });
      const token = data?.access_token;
      if (!token) return;

      // updated token for user
      setCookie("token", token);
      if (status === 201) {
        const userData = cookies.user_data;
        setCookie("user_data", { ...userData, role });
        navigate("/chat");
        console.log("role created success");
      }
    } catch (e) {
      console.error(e);
      navigate("/error");
    }
  };
  return (
    <Container>
      <LoginFormContainer>
        <LoginText>Get Started with TeamCode</LoginText>
        <RoleWrapper>
          <RoleLabel htmlFor="role">I am a </RoleLabel>
          <RoleSelect
            name="role"
            id="role"
            value={role}
            onChange={(e) => {
              const selectedRole = e.target.value;
              if (selectedRole as Role) setRole(selectedRole as Role);
            }}
          >
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
        <NextButton onClick={handleRoleSelection}>Next</NextButton>
      </LoginFormContainer>
    </Container>
  );
}

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
  cursor: pointer;

  &:hover {
    background-color: ${colors.theme["github-green-50"]};
  }
`;

const NextButton = styled.button`
  font-size: 1rem;
  padding: 0.4rem 0.8rem;
  cursor: pointer;

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

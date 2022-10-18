import { createContext, ReactNode, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { axiosTeamCode } from "../api/hooks";

export interface UserData {
  id: number;
  username: string;
  photo: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  role: "TEACHER" | "STRING";
  peerId: string;
  meetingId?: string;
}

const UserContext = createContext<null | any>(null);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [cookies] = useCookies(["user_data", "token"]);
  const [userData, setUserData] = useState<UserData>({} as UserData);
  useEffect(() => {
    let data = cookies.user_data;
    if (!data) return;
    setUserData(data as UserData);
  }, [cookies]);

  return (
    <UserContext.Provider value={{ user: userData, token: cookies.token }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };

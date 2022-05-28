import { createContext, ReactNode, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

interface UserContext {
  id: number;
  username: string;
  photo: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  role: string;
  peerId: string;
}

const UserContext = createContext<null | any>(null);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [cookies] = useCookies(["user_data"]);
  const [userData, setUserData] = useState<UserContext>({} as UserContext);
  useEffect(() => {
    let data = cookies.user_data;
    if (!data) return;
    setUserData(data as UserContext);
  }, [cookies]);
  return (
    <UserContext.Provider value={{ user: userData }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };

import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext, UserData } from "../../provider/UserProvider";

export const RoleBasedProtectedRoute = () => {
  const { user }: { user: UserData } = useContext(UserContext);

  const isTeacher = user.role === "TEACHER";

  return isTeacher ? <Outlet /> : <Navigate to="/meeting" />;
};

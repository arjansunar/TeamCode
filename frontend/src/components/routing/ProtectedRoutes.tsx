import { useCookies } from "react-cookie";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoutes = () => {
  const [cookie] = useCookies(["token"]);
  const token = cookie.token;

  let isAuth = false;

  if (!!token && String(token).length > 0) {
    isAuth = true;
  }
  console.log({ token, isAuth });

  return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

import { Navigate, Outlet } from "react-router-dom";

function AuthRoute() {
  const loginId = localStorage.getItem("loginId");
  return loginId ? <Outlet /> : <Navigate to="/" />;
}

export default AuthRoute;

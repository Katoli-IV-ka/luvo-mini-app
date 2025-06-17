import { useWebAppStore } from "@/store";
import { Navigate, Outlet } from "react-router-dom";
// import { checkTokenExpiration } from "@/utils/check-token.util";

export const AuthenticatedRoute = () => {
  const { user } = useWebAppStore();

  if (!user) {
    return <Navigate to="/" />;
  }

  // if (!checkTokenExpiration()) {
  //   return null;
  // }

  return <Outlet />;
};

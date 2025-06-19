import { useWebAppStore } from "@/store";
import { Navigate, Outlet } from "react-router-dom";
import { checkTokenExpiration } from "@/utils/check-token.util";

export const AuthenticatedRoute = () => {
  const { user, logout } = useWebAppStore();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!checkTokenExpiration()) {
    logout();
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

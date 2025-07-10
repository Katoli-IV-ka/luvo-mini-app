import { useWebAppStore } from "@/store";
import { Outlet, Navigate } from "react-router-dom";

export const UnauthenticatedRoute = () => {
  const { user } = useWebAppStore();
  return !user || !user?.isRegister ? <Outlet /> : <Navigate to="/feed" />;
};

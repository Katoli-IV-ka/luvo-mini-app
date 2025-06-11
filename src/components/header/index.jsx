import { useLocation, useNavigate } from "react-router-dom";
import { useWebAppStore } from "@/store";

import LogoDarkIcon from "./logo-dark.svg";
import LogoLightIcon from "./logo-light.svg";

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { webApp } = useWebAppStore();

  const isDark = webApp?.colorScheme === "dark";
  const LogoIcon = isDark ? LogoLightIcon : LogoDarkIcon;

  if (location.pathname == "/loading") return null;

  return (
    <div className="w-full py-7 px-5 border-b border-[#A29C9B4D]">
      <img src={LogoIcon} alt="logo-icon" onClick={() => navigate("/")} />
    </div>
  );
};

import { useWebAppStore } from "@/store";
import { useLocation, useNavigate } from "react-router-dom";

import LogoDarkIcon from "./logo-dark.svg";
import LogoLightIcon from "./logo-light.svg";

const excludedPaths = ["loading"];

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { webApp } = useWebAppStore();

  const isDark = webApp?.colorScheme === "dark";
  // const LogoIcon = isDark ? LogoLightIcon : LogoDarkIcon;
  const LogoIcon = LogoDarkIcon;

  if (excludedPaths.includes(location.pathname.substring(1))) return null;

  return (
    <div className="w-full py-7 px-5 border-b-2 bg-white/90 border-[#A29C9B4D]">
      <img src={LogoIcon} alt="logo-icon" onClick={() => navigate("/")} />
    </div>
  );
};

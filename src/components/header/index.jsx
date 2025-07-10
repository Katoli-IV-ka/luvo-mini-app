import { THEME } from "@/constants";
import { useWebAppStore } from "@/store";
import { useLocation, useNavigate } from "react-router-dom";

import LogoDarkIcon from "./logo-dark.svg";
import LogoLightIcon from "./logo-light.svg";

const excludedPaths = ["loading"];

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useWebAppStore();

  const isDark = theme === THEME.DARK;
  const LogoIcon = isDark ? LogoLightIcon : LogoDarkIcon;

  if (excludedPaths.includes(location.pathname.substring(1))) return null;

  return (
    <div className="relative z-10 w-full py-7 px-5 border-b-2 bg-white/90 dark:bg-black/90 border-[#A29C9B4D]">
      <img
        src={LogoIcon}
        alt="logo-icon"
        onClick={() => {
          if (!initData) return alert("initData не найден");
          navigator.clipboard.writeText(initData).then(() => {
            alert("initData скопирован!");
          });

          navigate("/");
        }}
      />
    </div>
  );
};

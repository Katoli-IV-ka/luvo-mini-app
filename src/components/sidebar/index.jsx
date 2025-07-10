import { HomeIcon } from "./home.jsx";
import { UserIcon } from "./user.jsx";
import { HeartIcon } from "./heart.jsx";
import { BarChartIcon } from "./bar-chart.jsx";
import { useWebAppStore } from "@/store/index.js";
import { useLocation, useNavigate } from "react-router-dom";

const excludedPaths = [
  "loading",
  "user-data",
  "photo-selection",
  "instagram-connect",
];

const sidebarData = [
  { icon: HomeIcon, url: "feed" },
  { icon: HeartIcon, url: "likes" },
  { icon: BarChartIcon, url: "rating" },
  { icon: UserIcon, url: "user-profile" },
];

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useWebAppStore();

  if (!user?.isRegister) return null;
  if (excludedPaths.includes(location.pathname.substring(1))) return null;

  return (
    <div className="relative z-10 mt-auto w-full pt-3.5 px-5 pb-[34px] flex justify-between border-t-2 bg-white/90 border-[#A29C9B4D] dark:bg-black/90">
      {sidebarData.map((item, index) => {
        const Icon = item.icon;
        const active = location.pathname.includes(item.url);

        return (
          <button
            key={index}
            onClick={() => navigate(`/${item.url}`)}
            className="focus:outline-none"
          >
            <Icon
              className={`w-8 h-8 transition-colors duration-200 ${
                active ? "text-[#A62739]" : "text-[#1E1E1E] dark:text-white"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

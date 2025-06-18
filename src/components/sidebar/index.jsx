import { HomeIcon } from "./home.jsx";
import { UserIcon } from "./user.jsx";
import { HeartIcon } from "./heart.jsx";
import { BarChartIcon } from "./bar-chart.jsx";
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

  if (excludedPaths.includes(location.pathname.substring(1))) return null;

  return (
    <div className="mt-auto w-full pt-3.5 px-5 pb-[34px] flex justify-between border-t-2 bg-white/90 border-[#A29C9B4D]">
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
                active ? "text-[#A62739]" : "text-[#1E1E1E]"
              }`}
            />
          </button>

          // <img
          //   key={index}
          //   src={item.icon}
          //   alt="sidebar-icon"
          //   onClick={() => navigate(`/${item.url}`)}
          // />
        );
      })}
    </div>
  );
};

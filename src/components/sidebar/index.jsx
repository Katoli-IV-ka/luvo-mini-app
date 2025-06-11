import { useLocation, useNavigate } from "react-router-dom";

import HomeIcon from "./home.svg";
import UserIcon from "./user.svg";
import HeartIcon from "./heart.svg";
import BarChartIcon from "./bar-chart.svg";

const excludedPaths = [
  "loading",
  "user-data",
  "photo-selection",
  "instagram-connect",
];

const sidebarData = [
  { icon: HomeIcon, url: "feed" },
  { icon: HeartIcon, url: "likes" },
  { icon: BarChartIcon, url: "statistic" },
  { icon: UserIcon, url: "profile" },
];

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  if (excludedPaths.includes(location.pathname.substring(1))) return null;

  return (
    <div className="w-full pt-3.5 px-5 pb-[34px] flex justify-between border-t-2 bg-white/90 border-[#A29C9B4D]">
      {sidebarData.map((item, index) => (
        <img
          key={index}
          src={item.icon}
          alt="sidebar-icon"
          onClick={() => navigate(`/${item.url}`)}
        />
      ))}
    </div>
  );
};

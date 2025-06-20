import { Link } from "react-router-dom";

export const LikesList = ({ data }) => {
  return (
    <div className="mt-10 grid grid-cols-2 gap-3">
      {data.map((user, index) => (
        <Link key={index} to="/other-profile">
          <img
            src={user.photos[0]}
            alt="likes-image"
            className="aspect-square object-cover rounded-[20px]"
          />

          <div className="mt-[5px] font-bold text-xl">
            {user.instagram_username}
          </div>
        </Link>
      ))}
    </div>
  );
};

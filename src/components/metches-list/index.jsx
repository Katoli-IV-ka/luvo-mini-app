import { Link } from "react-router-dom";

export const MetchesList = ({ metches }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {metches.map((metch, index) => (
        <Link key={index} to={`/other-profile/${metch.user_id}?isMetch=true`}>
          <img
            src={metch.photos[0]}
            alt="likes-image"
            className="aspect-square object-cover rounded-[20px]"
          />

          <div className="mt-[5px] font-bold text-xl">
            {metch.instagram_username}
          </div>
        </Link>
      ))}
    </div>
  );
};

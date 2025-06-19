import { Link } from "react-router-dom";

export const LikesList = ({ likes }) => {
  return (
    <div className="mt-10 grid grid-cols-2 gap-3">
      {likes.map((like, index) => (
        <Link key={index} to="/other-profile">
          <img src={like.image} alt="likes-image" className="rounded-[20px]" />

          <div className="mt-[5px] font-bold text-xl">{like.name}</div>
        </Link>
      ))}
    </div>
  );
};

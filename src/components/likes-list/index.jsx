export const LikesList = ({ likes }) => {
  return (
    <div className="mt-10 grid grid-cols-2 gap-3">
      {likes.map((like, index) => (
        <div key={index}>
          <img src={like.image} alt="likes-image" className="rounded-[20px]" />

          <div className="mt-[5px] font-bold text-xl text-black">
            {like.name}
          </div>
        </div>
      ))}
    </div>
  );
};

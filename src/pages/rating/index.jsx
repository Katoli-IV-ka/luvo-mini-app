import { useRating } from "@/api/rating";
import { Pedestal, RatingList } from "@/components";

export const RatingPage = () => {
  const { data, isLoading } = useRating();

  const sortByLikesDesc = (users) =>
    [...users].sort((a, b) => b.likes_count - a.likes_count);

  if (isLoading || !data.length) return null;

  return (
    <div className="w-full min-h-[calc(100vh-169px)] flex flex-col items-center">
      <div className="container mx-auto max-w-md p-5 overflow-y-auto scrollbar-hidden">
        <h1 className="font-bold text-[32px]">Рейтинг</h1>

        {data.length >= 4 && <Pedestal data={sortByLikesDesc(data)} />}

        <RatingList data={sortByLikesDesc(data)} />
      </div>
    </div>
  );
};

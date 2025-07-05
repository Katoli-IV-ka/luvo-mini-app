import { useRating } from "@/api/rating";
import { Pedestal, RatingList, Spinner } from "@/components";

export const RatingPage = () => {
  const { data, isLoading } = useRating();

  const sortByLikesDesc = (users) =>
    [...users].sort((a, b) => b.likes_count - a.likes_count);

  if (isLoading) {
    return (
      <div className="w-full min-h-[calc(100vh-169px)] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="w-full min-h-[calc(100vh-169px)] flex items-center justify-center">
        <div className="py-16 flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Пока нет рейтинга
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
            Рейтинг появится, когда пользователи начнут получать лайки
          </p>
        </div>
      </div>
    );
  }

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

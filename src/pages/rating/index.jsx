// import { useRating } from "@/api/rating";
import { Pedestal, RatingList } from "@/components";

const data = [
  {
    id: 0,
    user_id: 0,
    first_name: "string",
    birthdate: "2025-06-20",
    gender: "string",
    about: "string",
    telegram_username: "string",
    instagram_username: "string",
    photos: ["string"],
    created_at: "2025-06-20T04:59:21.966Z",
    likes_count: 0,
  },
  {
    id: 1,
    user_id: 1,
    first_name: "string",
    birthdate: "2025-06-20",
    gender: "string",
    about: "string",
    telegram_username: "string",
    instagram_username: "string",
    photos: ["string"],
    created_at: "2025-06-20T04:59:21.966Z",
    likes_count: 2,
  },
  {
    id: 2,
    user_id: 2,
    first_name: "string",
    birthdate: "2025-06-20",
    gender: "string",
    about: "string",
    telegram_username: "string",
    instagram_username: "string",
    photos: ["string"],
    created_at: "2025-06-20T04:59:21.966Z",
    likes_count: 4,
  },
  {
    id: 41,
    user_id: 2,
    first_name: "string",
    birthdate: "2025-06-20",
    gender: "string",
    about: "string",
    telegram_username: "string",
    instagram_username: "sefsefsefes",
    photos: ["string"],
    created_at: "2025-06-20T04:59:21.966Z",
    likes_count: 3,
  },
];

export const RatingPage = () => {
  // const { data, isLoading } = useRating();

  // if (isLoading) return null;

  const sortByLikesDesc = (users) => {
    return [...users].sort((a, b) => b.likes_count - a.likes_count);
  };

  console.log(data);

  return (
    <div className="w-full min-h-[calc(100vh-169px)] flex flex-col items-center">
      <div className="container mx-auto max-w-md p-5 overflow-y-auto scrollbar-hidden">
        <h1 className="font-bold text-[32px]">Рейтинг</h1>

        <Pedestal data={sortByLikesDesc(data)} />

        <RatingList data={sortByLikesDesc(data)} />
      </div>
    </div>
  );
};

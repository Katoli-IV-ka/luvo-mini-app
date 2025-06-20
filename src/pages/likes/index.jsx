import { useRef, useState } from "react";
import { useLikes } from "@/api/likes";
import { MetchModal, LikesCard, LikesList } from "@/components";

// const data = [
//   {
//     first_name: "string",
//     birthdate: "2025-06-20",
//     gender: "string",
//     about: "string",
//     latitude: 0,
//     longitude: 0,
//     id: 0,
//     user_id: 0,
//     telegram_username: "string",
//     instagram_username: "string",
//     photos: [
//       "https://picsum.photos/300?random=1",
//       "https://picsum.photos/300?random=2",
//     ],
//     created_at: "2025-06-20T05:42:36.694Z",
//   },
//   {
//     first_name: "string",
//     birthdate: "2025-06-20",
//     gender: "string",
//     about: "string",
//     latitude: 0,
//     longitude: 0,
//     id: 5,
//     user_id: 0,
//     telegram_username: "string",
//     instagram_username: "string",
//     photos: [
//       "https://picsum.photos/300?random=1",
//       "https://picsum.photos/300?random=2",
//     ],
//     created_at: "2025-06-20T05:42:36.694Z",
//   },
//   {
//     first_name: "string",
//     birthdate: "2025-06-20",
//     gender: "string",
//     about: "string",
//     latitude: 0,
//     longitude: 0,
//     id: 1,
//     user_id: 0,
//     telegram_username: "string",
//     instagram_username: "dfsf",
//     photos: [
//       "https://picsum.photos/300?random=1",
//       "https://picsum.photos/300?random=2",
//       "https://picsum.photos/300?random=3",
//     ],
//     created_at: "2025-06-20T05:42:36.694Z",
//   },
//   {
//     first_name: "string",
//     birthdate: "2025-06-20",
//     gender: "string",
//     about: "string",
//     latitude: 0,
//     longitude: 0,
//     id: 2,
//     user_id: 0,
//     telegram_username: "string",
//     instagram_username: "232",
//     photos: ["https://picsum.photos/300"],
//     created_at: "2025-06-20T05:42:36.694Z",
//   },
// ];

export const LikesPage = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const touchEndX = useRef(null);
  const touchStartX = useRef(null);

  const { data, isLoading } = useLikes();

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipe();
  };

  const handleSwipe = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (diff > threshold) {
      setCurrentCardIndex((prev) => (prev < data.length - 1 ? prev + 1 : prev));
    } else if (diff < -threshold) {
      setCurrentCardIndex((prev) => (prev > 0 ? prev - 1 : prev));
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const onCloseModal = () => setIsOpen(false);

  if (isLoading || !data.length) return null;

  console.log(data);

  return (
    <div className="w-full min-h-[calc(100vh-169px)] flex flex-col items-center">
      <div className="container mx-auto max-w-md p-5 overflow-y-auto scrollbar-hidden">
        <div
          className="relative"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <LikesCard card={data[currentCardIndex]} />
        </div>

        <div className="flex justify-center mt-4 space-x-2">
          {data.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentCardIndex ? "bg-primary-red" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        <LikesList data={data} />
      </div>

      {isOpen && <MetchModal isOpen={isOpen} onClose={onCloseModal} />}
    </div>
  );
};

import { useState } from "react";
import { useFeeds } from "@/api/feed";
import { FeedCard, MetchModal } from "@/components";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

export const FeedPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data, isLoading } = useFeeds();

  const [{ y }, api] = useSpring(() => ({ y: 0 }));

  const bind = useDrag(
    ({ down, movement: [_, my] }) => {
      if (!data?.length) return;

      if (!down) {
        if (Math.abs(my) > window.innerHeight * 0.2) {
          if (my > 0 && currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
          } else if (my < 0 && currentIndex < data.length - 1) {
            setCurrentIndex((prev) => prev + 1);
          }
        }
        api.start({ y: 0, config: { tension: 300, friction: 30 } });
      } else {
        api.start({ y: my, config: { tension: 300, friction: 30 } });
      }
    },
    { axis: "y" }
  );

  const onCloseModal = () => {
    setIsOpen(false);
  };

  if (isLoading || !data?.length) return null;
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="relative w-full h-full max-w-md">
        {data.map((_, index) => {
          if (index !== currentIndex) return null;

          return (
            <animated.div
              key={index}
              {...bind()}
              className="w-full h-full p-5"
              style={{
                touchAction: "none",
                transform: y.to((y) => `translateY(${y}px)`),
              }}
            >
              <FeedCard card={data[currentIndex]} />
            </animated.div>
          );
        })}
      </div>

      {isOpen && <MetchModal isOpen={isOpen} onClose={onCloseModal} />}
    </div>
  );
};

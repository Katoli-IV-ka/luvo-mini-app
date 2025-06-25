import { useState, useEffect } from "react";
import { useFeeds } from "../api/feed";

const BATCH_SIZE = 5;
const PRELOAD_THRESHOLD = 2;

export const useFeedBuffer = () => {
  const [skip, setSkip] = useState(0);
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data, isLoading, isFetching } = useFeeds(skip, BATCH_SIZE);

  // When receiving a new pack, add it to the general array
  useEffect(() => {
    if (data && data.length > 0) {
      setCards((prev) => {
        // To avoid duplication, you can filter
        const newIds = new Set(prev.map((c) => c.id));
        const filteredNew = data.filter((c) => !newIds.has(c.id));
        return [...prev, ...filteredNew];
      });
    }
  }, [data]);

  // Load the next batch when the index reaches the end
  useEffect(() => {
    if (cards.length === 0) return;
    if (currentIndex >= cards.length - PRELOAD_THRESHOLD && !isFetching) {
      setSkip((prev) => prev + BATCH_SIZE);
    }
  }, [currentIndex, cards, isFetching]);

  return {
    cards,
    currentIndex,
    setCurrentIndex,
    isLoading: isLoading && cards.length === 0,
  };
};

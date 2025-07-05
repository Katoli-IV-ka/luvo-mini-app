import { API_URL } from "@/constants";
import { queryClient } from "@/main";
import { axiosInstance } from "@/utils/axios.util";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useLiked = () =>
  useMutation({
    mutationFn: (userId) =>
      axiosInstance.post(`${API_URL}/interactions/like/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
    },
  });

export const useIgnored = () =>
  useMutation({
    mutationFn: (userId) =>
      axiosInstance.post(`${API_URL}/interactions/ignore/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
    },
  });

export const useFeeds = (skip = 0, limit = 5) => {
  return useQuery({
    queryKey: ["feeds", skip, limit],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`${API_URL}/feed/`, {
        params: { skip, limit },
      });
      return data;
    },
  });
};

export const useFeedView = () =>
  useMutation({
    mutationFn: (userId) =>
      axiosInstance.post(`${API_URL}/interactions/view/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
    },
  });

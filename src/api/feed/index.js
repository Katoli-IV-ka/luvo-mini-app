import { API_URL } from "@/constants";
import { queryClient } from "@/main";
import { axiosInstance } from "@/utils/axios.util";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useLiked = (id) =>
  useMutation({
    mutationFn: (body) => axiosInstance.post(`${API_URL}/like/${id}`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
    },
  });

export const useIgnored = (id) =>
  useMutation({
    mutationFn: (body) => axiosInstance.post(`${API_URL}/ignore/${id}`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
    },
  });

export const useFeeds = () => {
  return useQuery({
    queryKey: ["feeds"],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`${API_URL}/feed/`);
      return data;
    },
  });
};

import { API_URL } from "@/constants";
import { queryClient } from "@/main";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axios.util";

export const useLiked = (id) =>
  useMutation({
    mutationFn: (body) =>
      axiosInstance.post(`${API_URL}/profiles/${id}/like`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
    },
  });

export const useFeeds = () => {
  return useQuery({
    queryKey: ["feeds"],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`${API_URL}/feed/batch`);
      return data;
    },
  });
};

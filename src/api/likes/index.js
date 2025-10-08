import { API_URL } from "@/constants";
import { queryClient } from "@/main";
import { axiosInstance } from "@/utils/axios.util";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useLikes = () => {
  return useQuery({
    queryKey: ["likes"],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`${API_URL}/interactions/likes`);
      return data;
    },
  });
};

export const useMatches = () => {
  return useQuery({
    queryKey: ["matches"],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `${API_URL}/interactions/matches`
      );
      return data;
    },
  });
};

export const useIgnored = () =>
  useMutation({
    mutationFn: (userId) =>
      axiosInstance.post(`${API_URL}/interactions/ignore/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes"] });
    },
  });

import { API_URL } from "@/constants";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axios.util";

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

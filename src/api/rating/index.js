import { API_URL } from "@/constants";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axios.util";

export const useLikes = () => {
  return useQuery({
    queryKey: ["likes"],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`${API_URL}/like`);
      return data;
    },
  });
};

export const useRating = () => {
  return useQuery({
    queryKey: ["rating"],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`${API_URL}/top`);
      return data;
    },
  });
};

import { API_URL } from "@/constants";
import { queryClient } from "@/main";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axios.util";

export const useCreateProfile = () =>
  useMutation({
    mutationFn: (body) =>
      axiosInstance.post(`${API_URL}/profile/`, body, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`${API_URL}/profile/me`);
      return data;
    },
  });
};

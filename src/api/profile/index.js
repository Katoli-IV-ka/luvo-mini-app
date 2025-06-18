import { API_URL } from "@/constants";
import { queryClient } from "@/main";
import { axiosInstance } from "@/utils/axios.util";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateProfile = () =>
  useMutation({
    mutationFn: (body) =>
      axiosInstance.post(`${API_URL}/profile/create`, body, {
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

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: (body) =>
      axiosInstance.put(`${API_URL}/profile/me/update`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useOtherProfile = () => {
  return useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`${API_URL}/profiles`);
      return data;
    },
  });
};

import axios from "axios";
import { API_URL } from "@/constants";
import { useQuery } from "@tanstack/react-query";
// import { queryClient } from "@/App";

// export const useNewApiKey = () =>
//   useMutation({
//     mutationFn: (body) =>
//       axiosInstance.post(`${API_URL}/external/merchants/api-keys`, body),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["api-keys"] });
//     },
//   });

export const useApiKeys = () =>
  useQuery({
    queryKey: ["api-keys"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${API_URL}/external/merchants/api-keys`
      );
      return data;
    },
  });

// export const useDeleteApiKey = () =>
//   useMutation({
//     mutationFn: (id) =>
//       axiosInstance.delete(`${API_URL}/external/merchants/api-keys/${id}`),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["api-keys"] });
//     },
//   });

import { API_URL } from "@/constants";
import { axiosInstance } from "./axios.util";

export const loginByInitData = async (initData) => {
  const response = await axiosInstance.post(`${API_URL}/auth/login`, {
    init_data: initData,
  });
  return response.data;
};

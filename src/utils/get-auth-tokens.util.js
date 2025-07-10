import { USER_STORAGE_KEY } from "../constants";

export const buildAuthorizationHeader = (token) => `Bearer ${token}`;

export const getAccessToken = () => {
  const { user } = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
  return user?.accessToken ? buildAuthorizationHeader(user.accessToken) : null;
};

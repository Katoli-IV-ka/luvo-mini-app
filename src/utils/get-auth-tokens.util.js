import { USER_STORAGE_KEY } from "../constants";

export const buildAuthorizationHeader = (token) => `Bearer ${token}`;

export const getAccessToken = () => {
  const user = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
  return user?.user?.accessToken
    ? buildAuthorizationHeader(user.user.accessToken)
    : null;
};

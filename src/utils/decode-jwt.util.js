export const decodeJWT = (token) =>
  JSON.parse(window.atob(token.split(".")[1]));

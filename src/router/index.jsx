import { Navigate, Route, Routes } from "react-router-dom";
// import { AuthenticatedRoute, UnauthenticatedRoute } from "../components";
import {
  LoadingPage,
  UserDataPage,
  PhotoSelectionPage,
  InstagramConnectPage,
} from "../pages";

export const Router = () => {
  return (
    <Routes>
      <Route path="loading" element={<LoadingPage />} />
      <Route path="user-data" element={<UserDataPage />} />
      <Route path="photo-selection" element={<PhotoSelectionPage />} />
      <Route path="instagram-connect" element={<InstagramConnectPage />} />

      <Route path="*" element={<Navigate to="/instagram-connect" replace />} />
      {/* <Route element={<UnauthenticatedRoute />}></Routes> */}
      {/* <Route element={<AuthenticatedRoute />}></Routes> */}
    </Routes>
  );
};

import { Navigate, Route, Routes } from "react-router-dom";
// import { AuthenticatedRoute, UnauthenticatedRoute } from "../components";
import {
  FeedPage,
  LikesPage,
  RatingPage,
  LoadingPage,
  UserDataPage,
  UserProfilePage,
  OtherProfilePage,
  PhotoSelectionPage,
  InstagramConnectPage,
} from "../pages";

export const Router = () => {
  return (
    <Routes>
      <Route path="feed" element={<FeedPage />} />
      <Route path="likes" element={<LikesPage />} />
      <Route path="rating" element={<RatingPage />} />
      <Route path="loading" element={<LoadingPage />} />
      <Route path="user-data" element={<UserDataPage />} />
      <Route path="user-profile" element={<UserProfilePage />} />
      <Route path="other-profile" element={<OtherProfilePage />} />
      <Route path="photo-selection" element={<PhotoSelectionPage />} />
      <Route path="instagram-connect" element={<InstagramConnectPage />} />

      <Route path="*" element={<Navigate to="/instagram-connect" replace />} />
      {/* <Route element={<UnauthenticatedRoute />}></Routes> */}
      {/* <Route element={<AuthenticatedRoute />}></Routes> */}
    </Routes>
  );
};

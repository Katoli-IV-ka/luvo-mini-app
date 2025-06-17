import { Navigate, Route, Routes } from "react-router-dom";
import {
  AuthenticatedRoute,
  //  UnauthenticatedRoute
} from "../components";
import {
  FeedPage,
  LikesPage,
  RatingPage,
  LoadingPage,
  UserProfilePage,
  RegistrationPage,
  OtherProfilePage,
} from "../pages";

export const Router = () => {
  return (
    <Routes>
      <Route element={<AuthenticatedRoute />}>
        <Route path="feed" element={<FeedPage />} />
        <Route path="registration" element={<RegistrationPage />} />

        <Route path="likes" element={<LikesPage />} />
        <Route path="rating" element={<RatingPage />} />
        <Route path="loading" element={<LoadingPage />} />
        <Route path="user-profile" element={<UserProfilePage />} />
        <Route path="other-profile" element={<OtherProfilePage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
        {/* <Route element={<UnauthenticatedRoute />}></Routes> */}
      </Route>
    </Routes>
  );
};

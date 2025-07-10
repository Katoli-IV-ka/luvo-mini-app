import { Navigate, Route, Routes } from "react-router-dom";
import { AuthenticatedRoute, UnauthenticatedRoute } from "../components";
import {
  FeedPage,
  LikesPage,
  RatingPage,
  LoadingPage,
  ProfilePage,
  RegistrationPage,
  OtherProfilePage,
} from "../pages";

export const Router = () => {
  return (
    <Routes>
      <Route element={<UnauthenticatedRoute />}>
        <Route path="/registration" element={<RegistrationPage />} />
      </Route>

      <Route element={<AuthenticatedRoute />}>
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/likes" element={<LikesPage />} />
        <Route path="/rating" element={<RatingPage />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/user-profile" element={<ProfilePage />} />
        <Route path="/other-profile/:id" element={<OtherProfilePage />} />

        <Route path="*" element={<Navigate to="/feed" replace />} />
      </Route>
    </Routes>
  );
};

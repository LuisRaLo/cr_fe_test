import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtRouteComponent";
import HomePage from "../views/HomePage";
import PublicRoute from "../components/PubRouteComponent";
import SigningPage from "../views/SigningPage";
import SignupPage from "../views/SignupPage";

type IRoutesProps = {
  idToken: string | null;
};

export default function RouterComponent({
  idToken,
}: Readonly<IRoutesProps>): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          index
          element={
            <ProtectedRoute idToken={idToken}>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signin"
          element={
            <PublicRoute idToken={idToken}>
              <SigningPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute idToken={idToken}>
              <SignupPage />
            </PublicRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

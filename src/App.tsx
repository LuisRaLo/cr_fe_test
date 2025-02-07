import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SigningPage from "./views/SigningPage";
import HomePage from "./views/HomePage";
import { useState } from "react";
import "./assets/styles/app.css";
import SignupPage from "./views/SignupPage";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

function App(): JSX.Element {
  const [token, setToken] = useState("");

  const fakeAuth = (): Promise<string> =>
    new Promise((resolve) => {
      setTimeout(() => resolve("2342f2f1d131rf12"), 250);
    });

  const handleLogin = async () => {
    const jwt = await fakeAuth();

    console.log("token", token);

    setToken(jwt);
  };

  const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    if (!token) {
      return <Navigate to="/signin" replace />;
    }

    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          index
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route path="/signin" element={<SigningPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

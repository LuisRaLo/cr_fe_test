import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  children: ReactNode;
  idToken: string | undefined;
};

const ProtectedRoute = ({ children, idToken }: ProtectedRouteProps) => {
  if (!idToken) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;

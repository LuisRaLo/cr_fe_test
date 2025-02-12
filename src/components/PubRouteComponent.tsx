import { Navigate } from "react-router-dom";

type PublicRouteProps = {
  children: React.ReactNode;
  idToken: string | null;
};

const PublicRoute = ({ children, idToken }: PublicRouteProps) => {
  if (idToken) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;

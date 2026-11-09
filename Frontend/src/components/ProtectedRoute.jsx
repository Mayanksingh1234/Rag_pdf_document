import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useSelector(
    (state) => state.user.isloggedin
  );

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};  
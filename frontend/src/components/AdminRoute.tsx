import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

const AdminRoute = () => {
  const { user, token, isLoading } = useAppSelector((state) => state.auth);

  if (isLoading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;

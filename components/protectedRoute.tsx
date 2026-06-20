import { Outlet, Navigate } from "react-router";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useSelector(
    (state: any) => state.auth,
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen backdrop-blur-3xl bg-neutral-900">
        <Loader2 className="animate-spin text-gray-500" size={32} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return <Outlet />;
};

export const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useSelector(
    (state: any) => state.auth,
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen backdrop-blur-3xl bg-neutral-900">
        <Loader2 className="animate-spin text-gray-500" size={32} />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return <Outlet />;
};

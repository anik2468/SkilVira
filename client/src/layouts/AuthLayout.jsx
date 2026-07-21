import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
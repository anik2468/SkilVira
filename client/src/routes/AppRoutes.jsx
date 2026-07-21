import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

import Home from "../pages/Home/Home";
import ChooseRole from "../pages/ChooseRole/ChooseRole";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Main Website */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* Authentication */}
      <Route element={<AuthLayout />}>
        <Route path="/choose-role" element={<ChooseRole />} />

        {/* Temporary Login Pages */}
        <Route path="/student/login" element={<h1>Student Login</h1>} />
        <Route path="/recruiter/login" element={<h1>Recruiter Login</h1>} />
        <Route path="/college/login" element={<h1>College Login</h1>} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";
import StudentLayout from "../layouts/StudentLayout";

import ProtectedRoute from "../components/auth/ProtectedRoute";

// Public Pages
import Home from "../pages/Home/Home";
import ChooseRole from "../pages/ChooseRole/ChooseRole";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

// Control Center Pages
import Dashboard from "../pages/Admin/Dashboard";
import Internships from "../pages/Admin/Internships";

// Student Pages
import StudentDashboard from "../pages/Student/Dashboard";
import StudentInternships from "../pages/Student/Internships";
import InternshipDetails from "../pages/Student/InternshipDetails";
import Applications from "../pages/Student/Applications";
import SavedInternships from "../pages/Student/SavedInternships";
import StudentProfile from "../pages/Student/Profile";

const AppRoutes = () => {
  return (
    <Routes>

      {/* ================= Public Website ================= */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* ================= Authentication ================= */}
      <Route element={<AuthLayout />}>
        <Route path="/choose-role" element={<ChooseRole />} />
        <Route path="/login/:role" element={<Login />} />
      </Route>

      {/* Student Register */}
      <Route
        path="/register/student"
        element={<Register />}
      />

      {/* ================= Control Center ================= */}
      <Route
        element={
          <ProtectedRoute allowedRole="control">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/control/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/control/internships"
          element={<Internships />}
        />
      </Route>

      {/* ================= Student Panel ================= */}
      <Route
        element={
          <ProtectedRoute allowedRole="student">
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/student/dashboard"
          element={<StudentDashboard />}
        />

        <Route
          path="/student/internships"
          element={<StudentInternships />}
        />

        <Route
          path="/student/internships/:id"
          element={<InternshipDetails />}
        />

        <Route
          path="/student/applications"
          element={<Applications />}
        />

        <Route
          path="/student/saved"
          element={<SavedInternships />}
        />

        <Route
          path="/student/profile"
          element={<StudentProfile />}
        />
      </Route>

    </Routes>
  );
};

export default AppRoutes;
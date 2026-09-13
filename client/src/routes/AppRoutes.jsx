import { Routes, Route } from "react-router-dom";

// ================= Layouts =================

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

import StudentLayout from "../layouts/StudentLayout";
import RecruiterLayout from "../layouts/RecruiterLayout";
import EmployeeLayout from "../layouts/EmployeeLayout";
import AmbassadorLayout from "../layouts/AmbassadorLayout";
import AdminLayout from "../layouts/AdminLayout";

// ================= Auth =================

import ProtectedRoute from "../components/auth/ProtectedRoute";

// ================= Public =================

import Home from "../pages/Home/Home";
import ChooseRole from "../pages/ChooseRole/ChooseRole";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";

import VerifyCertificate from "../pages/VerifyCertificate/VerifyCertificate";

// ================= Student =================

import StudentDashboard from "../pages/Student/Dashboard";
import StudentCourses from "../pages/Student/Courses";
import CourseDetails from "../pages/Student/CourseDetails";
import StudentInternships from "../pages/Student/Internships";
import InternshipDetails from "../pages/Student/InternshipDetails";
import Applications from "../pages/Student/Applications";
import SavedInternships from "../pages/Student/SavedInternships";
import MyCourses from "../pages/Student/MyCourses";
import Certificates from "../pages/Student/Certificates";

import Profile from "../pages/Student/Profile";
import EditProfile from "../pages/Student/EditProfile";
import Notifications from "../pages/Student/Notifications";
import StudentSettings from "../pages/Student/Settings";
import LearnCourse from "../pages/Student/LearnCourse";

// New Student Modules
import MyDocuments from "../pages/Student/MyDocuments";
import MyOfferLetters from "../pages/Student/MyOfferLetters";
import MyStatus from "../pages/Student/MyStatus";

// ================= Recruiter =================

import RecruiterDashboard from "../pages/Recruiter/Dashboard";
import CompanyProfile from "../pages/Recruiter/CompanyProfile";
import RecruiterInternships from "../pages/Recruiter/Internships";
import CreateInternship from "../pages/Recruiter/CreateInternship";
import EditInternship from "../pages/Recruiter/EditInternship";
import RecruiterApplications from "../pages/Recruiter/Applications";

// ================= Employee =================

import EmployeeDashboard from "../pages/Employee/Dashboard";
import EmployeeUsers from "../pages/Employee/Users";
import EmployeeCompanies from "../pages/Employee/Companies";
import EmployeeUniversities from "../pages/Employee/Universities";
import EmployeeReports from "../pages/Employee/Reports";
import EmployeeCommunities from "../pages/Employee/Communities";
import EmployeeProfile from "../pages/Employee/Profile";

import EmployeeRecruiters from "../pages/Employee/Recruiters";
import EmployeeAmbassadors from "../pages/Employee/Ambassadors";
import EmployeeInternships from "../pages/Employee/Internships";
import EmployeeCreateInternship from "../pages/Employee/CreateInternship";

// ================= Ambassador =================

import AmbassadorDashboard from "../pages/Ambassador/Dashboard";
import AmbassadorAnalytics from "../pages/Ambassador/Analytics";
import AmbassadorReferrals from "../pages/Ambassador/Referrals";
import AmbassadorCommunities from "../pages/Ambassador/Communities";
import AmbassadorStudents from "../pages/Ambassador/Students";
import AmbassadorProfile from "../pages/Ambassador/Profile";

// ================= Admin =================

import ControlDashboard from "../pages/Admin/Dashboard";
import ControlInternships from "../pages/Admin/Internships";
import ControlRecruiters from "../pages/Admin/Recruiters";
import ControlStudents from "../pages/Admin/Students";
import ControlApplications from "../pages/Admin/Applications";
import ControlCertificates from "../pages/Admin/Certificates";
import ControlColleges from "../pages/Admin/Colleges";
import ControlSettings from "../pages/Admin/Settings";
import CreateUser from "../pages/Admin/CreateUser";
import Courses from "../pages/Admin/Courses";
import CourseLessons from "../pages/Admin/CourseLessons";
import CertificateTemplates from "../pages/Admin/CertificateTemplates";

const AppRoutes = () => {
  console.log("APP ROUTES LOADED");

  return (
    <Routes>
      {/* ================= Public ================= */}

      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* ================= Auth ================= */}

      <Route element={<AuthLayout />}>
        <Route
          path="/choose-role"
          element={<ChooseRole />}
        />

        <Route
          path="/login/:role"
          element={<Login />}
        />

        <Route
          path="/register/:role"
          element={<Register />}
        />
      </Route>

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password/:token"
        element={<ResetPassword />}
      />

      <Route
        path="/verify-certificate/:credentialId"
        element={<VerifyCertificate />}
      />

      {/* ================= Student ================= */}

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
          path="/student/courses"
          element={<StudentCourses />}
        />

        <Route
          path="/student/courses/:id"
          element={<CourseDetails />}
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
          path="/student/my-courses"
          element={<MyCourses />}
        />

        <Route
          path="/student/learn/:id"
          element={<LearnCourse />}
        />

        <Route
          path="/student/certificates"
          element={<Certificates />}
        />

        <Route
          path="/student/applications"
          element={<Applications />}
        />

        <Route
          path="/student/saved"
          element={<SavedInternships />}
        />

        {/* New Student Tracking */}

        <Route
          path="/student/status"
          element={<MyStatus />}
        />

        <Route
          path="/student/offer-letters"
          element={<MyOfferLetters />}
        />

        <Route
          path="/student/my-documents"
          element={<MyDocuments />}
        />

        {/* Profile */}

        <Route
          path="/student/profile"
          element={<Profile />}
        />

        <Route
          path="/student/profile/edit"
          element={<EditProfile />}
        />

        <Route
          path="/student/notifications"
          element={<Notifications />}
        />

        <Route
          path="/student/settings"
          element={<StudentSettings />}
        />
      </Route>

      {/* ================= Recruiter ================= */}

      <Route
        element={
          <ProtectedRoute allowedRole="recruiter">
            <RecruiterLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/recruiter/dashboard"
          element={<RecruiterDashboard />}
        />

        <Route
          path="/recruiter/company"
          element={<CompanyProfile />}
        />

        <Route
          path="/recruiter/internships"
          element={<RecruiterInternships />}
        />

        <Route
          path="/recruiter/internships/create"
          element={<CreateInternship />}
        />

        <Route
          path="/recruiter/internships/edit/:id"
          element={<EditInternship />}
        />

        <Route
          path="/recruiter/applications"
          element={<RecruiterApplications />}
        />
      </Route>

      {/* ================= Employee ================= */}

      <Route
        element={
          <ProtectedRoute allowedRole="employee">
            <EmployeeLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/employee/dashboard"
          element={<EmployeeDashboard />}
        />

        <Route
          path="/employee/users"
          element={<EmployeeUsers />}
        />

        <Route
          path="/employee/companies"
          element={<EmployeeCompanies />}
        />

        <Route
          path="/employee/universities"
          element={<EmployeeUniversities />}
        />

        <Route
          path="/employee/reports"
          element={<EmployeeReports />}
        />

        <Route
          path="/employee/communities"
          element={<EmployeeCommunities />}
        />

        <Route
          path="/employee/recruiters"
          element={<EmployeeRecruiters />}
        />

        <Route
          path="/employee/ambassadors"
          element={<EmployeeAmbassadors />}
        />

        <Route
          path="/employee/internships"
          element={<EmployeeInternships />}
        />

        <Route
          path="/employee/internships/create"
          element={<EmployeeCreateInternship />}
        />

        <Route
          path="/employee/profile"
          element={<EmployeeProfile />}
        />
      </Route>

      {/* ================= Ambassador ================= */}

      <Route
        element={
          <ProtectedRoute allowedRole="ambassador">
            <AmbassadorLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/ambassador/dashboard"
          element={<AmbassadorDashboard />}
        />

        <Route
          path="/ambassador/analytics"
          element={<AmbassadorAnalytics />}
        />

        <Route
          path="/ambassador/referrals"
          element={<AmbassadorReferrals />}
        />

        <Route
          path="/ambassador/communities"
          element={<AmbassadorCommunities />}
        />

        <Route
          path="/ambassador/students"
          element={<AmbassadorStudents />}
        />

        <Route
          path="/ambassador/profile"
          element={<AmbassadorProfile />}
        />
      </Route>

      {/* ================= Admin Control ================= */}

      <Route
        element={
          <ProtectedRoute allowedRole="control">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/control/dashboard"
          element={<ControlDashboard />}
        />

        <Route
          path="/control/courses"
          element={<Courses />}
        />

        <Route
          path="/control/internships"
          element={<ControlInternships />}
        />

        <Route
          path="/control/recruiters"
          element={<ControlRecruiters />}
        />

        <Route
          path="/control/students"
          element={<ControlStudents />}
        />

        <Route
          path="/control/applications"
          element={<ControlApplications />}
        />

        <Route
          path="/control/certificates"
          element={<ControlCertificates />}
        />

        <Route
          path="/control/colleges"
          element={<ControlColleges />}
        />

        <Route
          path="/control/settings"
          element={<ControlSettings />}
        />

        <Route
          path="/control/create-user"
          element={<CreateUser />}
        />

        <Route
          path="/control/courses/:id/lessons"
          element={<CourseLessons />}
        />

        <Route
          path="/control/certificate-templates"
          element={<CertificateTemplates />}
        />
      </Route>

      {/* ================= 404 ================= */}

      <Route
        path="*"
        element={
          <div className="flex min-h-screen items-center justify-center bg-white text-2xl font-bold text-gray-900">
            404 | Page Not Found
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
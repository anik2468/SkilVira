import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import StudentLayout from "../layouts/StudentLayout";
import RecruiterLayout from "../layouts/RecruiterLayout";
import EmployeeLayout from "../layouts/EmployeeLayout";
import AmbassadorLayout from "../layouts/AmbassadorLayout";
import AdminLayout from "../layouts/AdminLayout";

import ProtectedRoute from "../components/auth/ProtectedRoute";

// Public
import Home from "../pages/Home/Home";
import ContactSupport from "../pages/ContactSupport";
import CompanyContactSettings from "../pages/Admin/CompanyContactSettings";
import ChooseRole from "../pages/ChooseRole/ChooseRole";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import VerifyCertificate from "../pages/VerifyCertificate/VerifyCertificate";

// Student
import StudentDashboard from "../pages/Student/Dashboard";
import StudentCourses from "../pages/Student/Courses";
import CourseDetails from "../pages/Student/CourseDetails";
import CourseCheckout from "../pages/Student/CourseCheckout";
import StudentInternships from "../pages/Student/Internships";
import InternshipDetails from "../pages/Student/InternshipDetails";
import Applications from "../pages/Student/Applications";
import SavedInternships from "../pages/Student/SavedInternships";
import MyCourses from "../pages/Student/MyCourses";
import LearnCourse from "../pages/Student/LearnCourse";
import Certificates from "../pages/Student/Certificates";
import Profile from "../pages/Student/Profile";
import EditProfile from "../pages/Student/EditProfile";
import Notifications from "../pages/Student/Notifications";
import StudentSettings from "../pages/Student/Settings";
import MyDocuments from "../pages/Student/MyDocuments";
import MyOfferLetters from "../pages/Student/MyOfferLetters";
import MyStatus from "../pages/Student/MyStatus";
import ManualPayment from "../pages/Student/ManualPayment";

// Recruiter
import RecruiterDashboard from "../pages/Recruiter/Dashboard";
import CompanyProfile from "../pages/Recruiter/CompanyProfile";
import RecruiterProfile from "../pages/Recruiter/Profile";
import RecruiterInternships from "../pages/Recruiter/Internships";
import CreateInternship from "../pages/Recruiter/CreateInternship";
import EditInternship from "../pages/Recruiter/EditInternship";
import RecruiterApplications from "../pages/Recruiter/Applications";
import RecruiterStudents from "../pages/Recruiter/Students";
import RecruiterSettings from "../pages/Recruiter/Settings";

// Employee
import EmployeeDashboard from "../pages/Employee/Dashboard";
import EmployeeUsers from "../pages/Employee/Users";
import EmployeeCompanies from "../pages/Employee/Companies";
import EmployeeUniversities from "../pages/Employee/Universities";
import EmployeeReportsVerification from "../pages/Employee/ReportsVerification";
import EmployeeReportTemplates from "../pages/Employee/ReportTemplates";
import EmployeeCommunities from "../pages/Employee/Communities";
import EmployeeProfile from "../pages/Employee/Profile";
import EmployeeSettings from "../pages/Employee/Settings";
import EmployeeRecruiters from "../pages/Employee/Recruiters";
import EmployeeAmbassadors from "../pages/Employee/Ambassadors";
import EmployeeInternships from "../pages/Employee/Internships";
import EmployeeCreateInternship from "../pages/Employee/CreateInternship";
import EmployeeCertificateTemplates from "../pages/Employee/CertificateTemplates";
import EmployeeCertificateVerification from "../pages/Employee/CertificateVerification";
import EmployeeOfferLetterTemplates from "../pages/Employee/OfferLetterTemplates";
import EmployeeOfferLetterVerification from "../pages/Employee/OfferLetterVerification";
import EmployeePaymentSettings from "../pages/Employee/PaymentSettings";
import EmployeePaymentVerification from "../pages/Employee/PaymentVerification";

// Ambassador
import AmbassadorDashboard from "../pages/Ambassador/Dashboard";
import AmbassadorAnalytics from "../pages/Ambassador/Analytics";
import AmbassadorReferrals from "../pages/Ambassador/Referrals";
import AmbassadorCommunities from "../pages/Ambassador/Communities";
import AmbassadorStudents from "../pages/Ambassador/Students";
import AmbassadorProfile from "../pages/Ambassador/Profile";

// Control
import ControlDashboard from "../pages/Admin/Dashboard";
import ControlInternships from "../pages/Admin/Internships";
import ControlRecruiters from "../pages/Admin/Recruiters";
import ControlStudents from "../pages/Admin/Students";
import ControlApplications from "../pages/Admin/Applications";
import ControlCertificates from "../pages/Admin/Certificates";
import ControlColleges from "../pages/Admin/Colleges";
import ControlSettings from "../pages/Admin/Settings";
import ControlEmployees from "../pages/Admin/Employees";
import ControlEmployeeActivity from "../pages/Admin/EmployeeActivity";
import CreateUser from "../pages/Admin/CreateUser";
import Courses from "../pages/Admin/Courses";
import CourseLessons from "../pages/Admin/CourseLessons";
import LiveClassroom from "../pages/LiveClassroom";
import ReferralPricingSettings from "../pages/Admin/ReferralPricingSettings";
import CertificateTemplates from "../pages/Admin/CertificateTemplates";

const NotFound = () => (
  <div className="flex min-h-screen items-center justify-center bg-white px-6 text-center">
    <div>
      <p className="text-6xl font-black text-[#D4AF37]">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">
        Page Not Found
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        The page you are looking for does not exist.
      </p>
    </div>
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<StudentCourses />} />
        <Route path="/internships" element={<StudentInternships />} />
        <Route path="/contact" element={<ContactSupport />} />

        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/internships/:id" element={<InternshipDetails />} />
</Route>

      {/* Auth */}
      <Route element={<AuthLayout />}>
        <Route path="/choose-role" element={<ChooseRole />} />
        <Route path="/login/:role" element={<Login />} />
        <Route path="/register/:role" element={<Register />} />
      </Route>

      {/* Alternate control login URLs */}
      <Route
        path="/control/login"
        element={<Navigate to="/login/control" replace />}
      />
      <Route
        path="/admin/login"
        element={<Navigate to="/login/control" replace />}
      />

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route
        path="/verify-certificate/:credentialId"
        element={<VerifyCertificate />}
      />

      {/* Student */}
      <Route
        element={
          <ProtectedRoute allowedRole="student">
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/student/dashboard" element={<StudentDashboard />} />

        <Route path="/student/courses" element={<StudentCourses />} />
        <Route path="/student/courses/:id" element={<CourseDetails />} />
        <Route path="/student/course-checkout/:id" element={<CourseCheckout />} />
        <Route path="/student/my-courses" element={<MyCourses />} />
        <Route path="/student/learn/:id" element={<LearnCourse />} />
        <Route path="/student/live-class/:id" element={<LiveClassroom />} />

        <Route path="/student/internships" element={<StudentInternships />} />
        <Route
          path="/student/internships/:id"
          element={<InternshipDetails />}
        />

        <Route path="/student/applications" element={<Applications />} />
        <Route path="/student/saved" element={<SavedInternships />} />

        <Route path="/student/certificates" element={<Certificates />} />
        <Route path="/student/status" element={<MyStatus />} />
        <Route path="/student/manual-payment" element={<ManualPayment />} />
        <Route path="/student/offer-letters" element={<MyOfferLetters />} />
        <Route path="/student/my-documents" element={<MyDocuments />} />

        <Route path="/student/profile" element={<Profile />} />
        <Route path="/student/profile/edit" element={<EditProfile />} />

        <Route path="/student/notifications" element={<Notifications />} />
        <Route path="/student/settings" element={<StudentSettings />} />
      </Route>

      {/* Recruiter */}
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

        <Route path="/recruiter/company" element={<CompanyProfile />} />
        <Route path="/recruiter/profile" element={<RecruiterProfile />} />

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

        {/* Previously missing routes */}
        <Route
          path="/recruiter/students"
          element={<RecruiterStudents />}
        />
        <Route
          path="/recruiter/settings"
          element={<RecruiterSettings />}
        />
      </Route>

      {/* Employee */}
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
          <Route path="/employee/contact-settings" element={<CompanyContactSettings />} />
          <Route path="/employee/referral-settings" element={<ReferralPricingSettings />} />

        <Route
          path="/employee/courses"
          element={<Courses />}
        />
          <Route
            path="/employee/courses/:id/lessons"
            element={<CourseLessons />}
          />
          <Route path="/employee/live-class/:id" element={<LiveClassroom />} />

        <Route path="/employee/users" element={<EmployeeUsers />} />
        <Route path="/employee/companies" element={<EmployeeCompanies />} />
        <Route
          path="/employee/universities"
          element={<EmployeeUniversities />}
        />

        <Route
          path="/employee/reports"
          element={<EmployeeReportsVerification />}
        />
        <Route
          path="/employee/reports/verification"
          element={<EmployeeReportsVerification />}
        />
        <Route
          path="/employee/report-templates"
          element={<EmployeeReportTemplates />}
        />

        <Route
          path="/employee/certificate-templates"
          element={<EmployeeCertificateTemplates />}
        />
        <Route
          path="/employee/certificates/verification"
          element={<EmployeeCertificateVerification />}
        />
        <Route
          path="/employee/certificate-verification"
          element={<EmployeeCertificateVerification />}
        />

        <Route
          path="/employee/offer-letter-templates"
          element={<EmployeeOfferLetterTemplates />}
        />
        <Route
          path="/employee/offer-letters/verification"
          element={<EmployeeOfferLetterVerification />}
        />
        <Route
          path="/employee/offer-letter-verification"
          element={<EmployeeOfferLetterVerification />}
        />

        <Route
          path="/employee/payment-settings"
          element={<EmployeePaymentSettings />}
        />
        <Route
          path="/employee/payment-verification"
          element={<EmployeePaymentVerification />}
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
        <Route path="/employee/settings" element={<EmployeeSettings />} />
        <Route
          path="/employee/profile"
          element={<EmployeeProfile />}
        />
      </Route>

      {/* Ambassador */}
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

      {/* Control panel */}
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
          <Route path="/control/contact-settings" element={<CompanyContactSettings />} />
          <Route path="/control/referral-settings" element={<ReferralPricingSettings />} />

        <Route path="/control/courses" element={<Courses />} />
          <Route
            path="/control/courses/:id/lessons"
            element={<CourseLessons />}
          />
          <Route path="/control/live-class/:id" element={<LiveClassroom />} />

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
          path="/control/certificate-templates"
          element={<CertificateTemplates />}
        />
        <Route path="/control/colleges" element={<ControlColleges />} />
        <Route path="/control/create-user" element={<CreateUser />} />
        <Route path="/control/employees" element={<ControlEmployees />} />

        <Route path="/control/employee-activity" element={<ControlEmployeeActivity />} />

        {/* Additional employee tools available to Control/Admin */}
        <Route path="/control/users" element={<EmployeeUsers />} />
        <Route path="/control/companies" element={<EmployeeCompanies />} />
        <Route path="/control/universities" element={<EmployeeUniversities />} />
        <Route path="/control/communities" element={<EmployeeCommunities />} />
        <Route path="/control/ambassadors" element={<EmployeeAmbassadors />} />
        <Route path="/control/recruiter-approval" element={<EmployeeRecruiters />} />
        <Route path="/control/internships/approval" element={<EmployeeInternships />} />
        <Route path="/control/internships/create" element={<EmployeeCreateInternship />} />
        <Route path="/control/payment-settings" element={<EmployeePaymentSettings />} />
        <Route path="/control/payment-verification" element={<EmployeePaymentVerification />} />
        <Route path="/control/offer-letter-templates" element={<EmployeeOfferLetterTemplates />} />
        <Route path="/control/offer-letters/verification" element={<EmployeeOfferLetterVerification />} />
        <Route path="/control/employee-certificate-templates" element={<EmployeeCertificateTemplates />} />
        <Route path="/control/certificates/verification" element={<EmployeeCertificateVerification />} />
        <Route path="/control/reports" element={<EmployeeReportsVerification />} />
        <Route path="/control/reports/verification" element={<EmployeeReportsVerification />} />
        <Route path="/control/report-templates" element={<EmployeeReportTemplates />} />
        <Route path="/control/settings" element={<ControlSettings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
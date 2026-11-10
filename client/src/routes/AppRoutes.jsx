import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import StudentLayout from "../layouts/StudentLayout";
import RecruiterLayout from "../layouts/RecruiterLayout";
import EmployeeLayout from "../layouts/EmployeeLayout";
import AmbassadorLayout from "../layouts/AmbassadorLayout";
import AdminLayout from "../layouts/AdminLayout";
import LimitedAdminLayout from "../layouts/LimitedAdminLayout";

import ProtectedRoute from "../components/auth/ProtectedRoute";

// Public









// Student



















// Recruiter









// Employee



















// Ambassador






// Control

















const Home = lazy(() => import("../pages/Home/Home"));
const ContactSupport = lazy(() => import("../pages/ContactSupport"));
const CompanyContactSettings = lazy(() => import("../pages/Admin/CompanyContactSettings"));
const ChooseRole = lazy(() => import("../pages/ChooseRole/ChooseRole"));
const Login = lazy(() => import("../pages/Login/Login"));
const Register = lazy(() => import("../pages/Register/Register"));
const ForgotPassword = lazy(() => import("../pages/Auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/Auth/ResetPassword"));
const VerifyCertificate = lazy(() => import("../pages/VerifyCertificate/VerifyCertificate"));
const StudentDashboard = lazy(() => import("../pages/Student/Dashboard"));
const StudentCourses = lazy(() => import("../pages/Student/Courses"));
const CourseDetails = lazy(() => import("../pages/Student/CourseDetails"));
const CourseCheckout = lazy(() => import("../pages/Student/CourseCheckout"));
const StudentInternships = lazy(() => import("../pages/Student/Internships"));
const InternshipDetails = lazy(() => import("../pages/Student/InternshipDetails"));
const Applications = lazy(() => import("../pages/Student/Applications"));
const SavedInternships = lazy(() => import("../pages/Student/SavedInternships"));
const MyCourses = lazy(() => import("../pages/Student/MyCourses"));
const LearnCourse = lazy(() => import("../pages/Student/LearnCourse"));
const Certificates = lazy(() => import("../pages/Student/Certificates"));
const Profile = lazy(() => import("../pages/Student/Profile"));
const EditProfile = lazy(() => import("../pages/Student/EditProfile"));
const Notifications = lazy(() => import("../pages/Student/Notifications"));
const StudentSettings = lazy(() => import("../pages/Student/Settings"));
const MyDocuments = lazy(() => import("../pages/Student/MyDocuments"));
const MyOfferLetters = lazy(() => import("../pages/Student/MyOfferLetters"));
const MyStatus = lazy(() => import("../pages/Student/MyStatus"));
const ManualPayment = lazy(() => import("../pages/Student/ManualPayment"));
const RecruiterDashboard = lazy(() => import("../pages/Recruiter/Dashboard"));
const CompanyProfile = lazy(() => import("../pages/Recruiter/CompanyProfile"));
const RecruiterProfile = lazy(() => import("../pages/Recruiter/Profile"));
const RecruiterInternships = lazy(() => import("../pages/Recruiter/Internships"));
const CreateInternship = lazy(() => import("../pages/Recruiter/CreateInternship"));
const EditInternship = lazy(() => import("../pages/Recruiter/EditInternship"));
const RecruiterApplications = lazy(() => import("../pages/Recruiter/Applications"));
const RecruiterStudents = lazy(() => import("../pages/Recruiter/Students"));
const RecruiterSettings = lazy(() => import("../pages/Recruiter/Settings"));
const EmployeeDashboard = lazy(() => import("../pages/Employee/Dashboard"));
const EmployeeUsers = lazy(() => import("../pages/Employee/Users"));
const EmployeeCompanies = lazy(() => import("../pages/Employee/Companies"));
const EmployeeUniversities = lazy(() => import("../pages/Employee/Universities"));
const EmployeeReportsVerification = lazy(() => import("../pages/Employee/ReportsVerification"));
const EmployeeReportTemplates = lazy(() => import("../pages/Employee/ReportTemplates"));
const EmployeeCommunities = lazy(() => import("../pages/Employee/Communities"));
const EmployeeProfile = lazy(() => import("../pages/Employee/Profile"));
const EmployeeSettings = lazy(() => import("../pages/Employee/Settings"));
const EmployeeRecruiters = lazy(() => import("../pages/Employee/Recruiters"));
const EmployeeAmbassadors = lazy(() => import("../pages/Employee/Ambassadors"));
const EmployeeInternships = lazy(() => import("../pages/Employee/Internships"));
const EmployeeCreateInternship = lazy(() => import("../pages/Employee/CreateInternship"));
const EmployeeCertificateTemplates = lazy(() => import("../pages/Employee/CertificateTemplates"));
const EmployeeCertificateVerification = lazy(() => import("../pages/Employee/CertificateVerification"));
const EmployeeOfferLetterTemplates = lazy(() => import("../pages/Employee/OfferLetterTemplates"));
const EmployeeOfferLetterVerification = lazy(() => import("../pages/Employee/OfferLetterVerification"));
const EmployeePaymentSettings = lazy(() => import("../pages/Employee/PaymentSettings"));
const EmployeePaymentVerification = lazy(() => import("../pages/Employee/PaymentVerification"));
const AmbassadorDashboard = lazy(() => import("../pages/Ambassador/Dashboard"));
const AmbassadorAnalytics = lazy(() => import("../pages/Ambassador/Analytics"));
const AmbassadorReferrals = lazy(() => import("../pages/Ambassador/Referrals"));
const AmbassadorCommunities = lazy(() => import("../pages/Ambassador/Communities"));
const AmbassadorStudents = lazy(() => import("../pages/Ambassador/Students"));
const AmbassadorProfile = lazy(() => import("../pages/Ambassador/Profile"));
const AmbassadorEditProfile = lazy(() => import("../pages/Ambassador/EditProfile"));
const ControlDashboard = lazy(() => import("../pages/Admin/Dashboard"));
const LimitedAdminDashboard = lazy(() => import("../pages/Admin/LimitedDashboard"));
const LimitedAdminUsers = lazy(() => import("../pages/Admin/LimitedUsers"));
const ControlInternships = lazy(() => import("../pages/Admin/Internships"));
const ControlRecruiters = lazy(() => import("../pages/Admin/Recruiters"));
const ControlStudents = lazy(() => import("../pages/Admin/Students"));
const ControlApplications = lazy(() => import("../pages/Admin/Applications"));
const ControlCertificates = lazy(() => import("../pages/Admin/Certificates"));
const ControlColleges = lazy(() => import("../pages/Admin/Colleges"));
const ControlSettings = lazy(() => import("../pages/Admin/Settings"));
const ControlEmployees = lazy(() => import("../pages/Admin/Employees"));
const ControlEmployeeActivity = lazy(() => import("../pages/Admin/EmployeeActivity"));
const CreateUser = lazy(() => import("../pages/Admin/CreateUser"));
const Courses = lazy(() => import("../pages/Admin/Courses"));
const CourseLessons = lazy(() => import("../pages/Admin/CourseLessons"));
const LiveClassroom = lazy(() => import("../pages/LiveClassroom"));
const ReferralPricingSettings = lazy(() => import("../pages/Admin/ReferralPricingSettings"));
const CertificateTemplates = lazy(() => import("../pages/Admin/CertificateTemplates"));
const CourseAnalytics = lazy(() => import("../pages/CourseAnalytics"));

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
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-gray-500">Loading page...</div>}>
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
        element={<Navigate to="/login/admin" replace />}
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

        <Route
          path="/employee/courses"
          element={<Courses />}
        />
        <Route path="/employee/course-analytics" element={<CourseAnalytics />} />
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
          path="/ambassador/profile/edit"
          element={<AmbassadorEditProfile />}
        />
        <Route
          path="/ambassador/profile"
          element={<AmbassadorProfile />}
        />
      </Route>

      {/* Restricted Admin panel: separate from Super Admin */}
      <Route
        element={
          <ProtectedRoute allowedRole="admin">
            <LimitedAdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<LimitedAdminDashboard />} />
        <Route path="/admin/users" element={<LimitedAdminUsers />} />
        <Route path="/admin/recruiters" element={<ControlRecruiters />} />
        <Route path="/admin/ambassadors" element={<EmployeeAmbassadors />} />
        <Route path="/admin/internships" element={<ControlInternships />} />
        <Route path="/admin/applications" element={<ControlApplications />} />
        <Route path="/admin/certificates" element={<ControlCertificates />} />
        <Route path="/admin/courses" element={<Courses />} />
        <Route path="/admin/courses/:id/lessons" element={<CourseLessons />} />
        <Route path="/admin/live-class/:id" element={<LiveClassroom />} />
        <Route path="/admin/course-analytics" element={<CourseAnalytics />} />
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
        <Route path="/control/course-analytics" element={<CourseAnalytics />} />
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
    </Suspense>
  );
};

export default AppRoutes;
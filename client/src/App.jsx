import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './layouts/Layout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Programs from './pages/Programs.jsx'
import Volunteer from './pages/Volunteer.jsx'
import Donate from './pages/Donate.jsx'
import Transparency from './pages/Transparency.jsx'
import Contact from './pages/Contact.jsx'
import Gallery from './pages/Gallery.jsx'
import Blog from './pages/Blog.jsx'
import BlogPost from './pages/BlogPost.jsx'
import Courses from './pages/Courses.jsx'
import CourseDetail from './pages/CourseDetail.jsx'
import Membership from './pages/Membership.jsx'
import FDPPage from './pages/FDPPage.jsx'
import FDPDetail from './pages/FDPDetail.jsx'
import CertVerify from './pages/CertVerify.jsx'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import ForgotPassword from './pages/auth/ForgotPassword.jsx'
import ResetPassword from './pages/auth/ResetPassword.jsx'
import VerifyEmail from './pages/auth/VerifyEmail.jsx'
import AdminDashboard from './pages/admin/Dashboard.jsx'
import AdminUsers from './pages/admin/Users.jsx'
import AdminAdmissions from './pages/admin/Admissions.jsx'
import AdminDonations from './pages/admin/Donations.jsx'
import AdminBlog from './pages/admin/Blog.jsx'
import AdminCourses from './pages/admin/Courses.jsx'
import AdminGallery from './pages/admin/Gallery.jsx'
import AdminVolunteers from './pages/admin/Volunteers.jsx'
import AdminMemberships from './pages/admin/Memberships.jsx'
import AdminFDP from './pages/admin/FDP.jsx'
import AdminContacts from './pages/admin/Contacts.jsx'
import AdminDownloads from './pages/admin/Downloads.jsx'
import AdminCertificates from './pages/admin/Certificates.jsx'
import CancellationPolicy from './pages/CancellationPolicy.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="programs" element={<Programs />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:slug" element={<CourseDetail />} />
          <Route path="membership" element={<Membership />} />
          <Route path="fdp" element={<FDPPage />} />
          <Route path="fdp/:id" element={<FDPDetail />} />
          <Route path="cert-verify" element={<CertVerify />} />
          <Route path="volunteer" element={<Volunteer />} />
          <Route path="donate" element={<Donate />} />
          <Route path="transparency" element={<Transparency />} />
          <Route path="contact" element={<Contact />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="cancellation-policy" element={<CancellationPolicy />} />
        </Route>

        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="auth/forgot-password" element={<ForgotPassword />} />
        <Route path="auth/reset-password" element={<ResetPassword />} />
        <Route path="auth/verify-email" element={<VerifyEmail />} />

        <Route
          path="admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="admissions" element={<AdminAdmissions />} />
          <Route path="donations" element={<AdminDonations />} />
          <Route path="memberships" element={<AdminMemberships />} />
          <Route path="volunteers" element={<AdminVolunteers />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="fdp" element={<AdminFDP />} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="contacts" element={<AdminContacts />} />
          <Route path="downloads" element={<AdminDownloads />} />
          <Route path="certificates" element={<AdminCertificates />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

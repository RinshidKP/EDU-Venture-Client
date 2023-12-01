import { Routes, Route } from 'react-router-dom';
import ProtectedStudentRoutes from '../helpers/ProtectedStudentRoutes.jsx';

import StudentProfilePage from '../pages/Student/StudentProfilePage.jsx'
import StudentEditProfilePage from '../pages/Student/StudentEditProfilePage.jsx'

import CourseDetailsPage from '../pages/Student/CourseDetailsPage.jsx';
import ConsultentProfilePage from '../pages/Student/ConsultentProfilePage.jsx';
import ConfirmNewPasswordPage from '../pages/ConfirmNewPasswordPage.jsx';
import ListAllCoursesPage from '../pages/Student/ListAllCoursesPage.jsx';
import ListAllConsultenciesPage from '../pages/Student/ListAllConsultenciesPage.jsx';
import StudentChatPage from '../pages/Student/StudentChatPage.jsx';
import StudentCountriesPage from '../pages/Student/StudentCountriesPage.jsx';
import CreateBlogPage from '../pages/Student/CreateBlogPage.jsx';
import EditBlogPage from '../pages/Student/EditBlogPage.jsx';
import ListAllBlogs from '../pages/Student/ListAllBlogs.jsx';
import StudentsApplications from '../pages/Student/StudentsApplications.jsx';
import StudentsBlogs from '../pages/Student/StudentsBlogs.jsx';
import ListCoursesByCountry from '../pages/Student/ListCoursesByCountry.jsx';
import PaymentSuccess from '../pages/Student/PaymentSuccess.jsx';
import PaymentCancel from '../pages/Student/PaymentCancel.jsx';
import PassportDetails from '../pages/Student/PassportDetails.jsx';
import CertificateDetails from '../pages/Student/CertificateDetails.jsx';

const StudentRoutes = () => {
  return (
    <div>

      <Routes>
        <Route path="/student_profile" element={<ProtectedStudentRoutes>
          <StudentProfilePage />
        </ProtectedStudentRoutes>
        } />
        <Route path="/student/edit_profile" element={<ProtectedStudentRoutes>
          <StudentEditProfilePage />
        </ProtectedStudentRoutes>
        } />
        <Route path="/course_details" element={
          <CourseDetailsPage />
        } />
        <Route path="/consultent_details" element={
          <ConsultentProfilePage />
        } />

        <Route path="/new_password" element={<ProtectedStudentRoutes>
          <ConfirmNewPasswordPage />
        </ProtectedStudentRoutes>
        } />
        <Route path="/new_blog" element={<ProtectedStudentRoutes>
          <CreateBlogPage />
        </ProtectedStudentRoutes>
        } />
        <Route path="/edit_blog" element={<ProtectedStudentRoutes>
          <EditBlogPage />
        </ProtectedStudentRoutes>
        } />
        
        <Route path="/student_courses" element={
          <ListAllCoursesPage />
        } />

        <Route path="/student_consultents" element={
          <ListAllConsultenciesPage />
        } />

        <Route path="/student_chat" element={
          <ProtectedStudentRoutes>
            <StudentChatPage />
          </ProtectedStudentRoutes>
        } />
        <Route path="/student_countries" element={
          <StudentCountriesPage />
        } />
        <Route path="/student_applications" element={
          <StudentsApplications />
        } />
        <Route path="/student_blogs" element={
          <StudentsBlogs />
        } />
        <Route path="/blogs" element={
          <ListAllBlogs />
        } />
        <Route path="/view_courses_by_country" element={
          <ListCoursesByCountry />
        } />
        <Route path="/course_details/success/:applicationId" element={
          <PaymentSuccess />
        } />
        <Route path="/course_details/cancel/:applicationId" element={
          <PaymentCancel />
        } />
        <Route path="/edit_passport_details" element={
          <PassportDetails />
        } />
        <Route path="/edit_certificate_details" element={
          <CertificateDetails />
        } />

      </Routes>

    </div>
  )
}

export default StudentRoutes
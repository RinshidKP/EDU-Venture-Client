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
        <Route path="/blogs" element={
          <ListAllBlogs />
        } />

      </Routes>

    </div>
  )
}

export default StudentRoutes
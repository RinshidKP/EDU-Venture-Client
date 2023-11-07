import { Routes, Route } from 'react-router-dom'
import ProtectedConsultentRoutes from '../helpers/ProtectedConsultentRoutes'

import ConsultentHomePage from '../pages/Consultent/ConsultentHomePage'
import ConsultentProfile from '../pages/Consultent/ConsultentProfile'
import ConsultentEditProfile from '../pages/Consultent/ConsultentEditProfile'
import CreateCourse from '../pages/CreateCourse'
import CourseDetailsPage from '../pages/Consultent/CourseDetailsPage'
import EditCoursesPage from '../pages/Consultent/EditCoursesPage'
import ConfirmNewPasswordPage from '../pages/ConfirmNewPasswordPage'
import StudentPage from '../pages/Consultent/StudentPage'
import StudentProfilePage from '../pages/Consultent/StudentProfilePage'
import ConsultentChatPage from '../pages/Consultent/ConsultentChatPage'
const ConsultentRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path='/consultent' element={<ProtectedConsultentRoutes>
          <ConsultentHomePage />
        </ProtectedConsultentRoutes>
        } />

        <Route path='/profile' element={<ProtectedConsultentRoutes>
          <ConsultentProfile />
        </ProtectedConsultentRoutes>
        } />

        <Route path='/profile/edit_profile' element={<ProtectedConsultentRoutes>
          <ConsultentEditProfile />
        </ProtectedConsultentRoutes>
        } />
        <Route path='/profile/create_course' element={<ProtectedConsultentRoutes>
          <CreateCourse />
        </ProtectedConsultentRoutes>
        } />
        <Route path='/profile/create_details' element={<ProtectedConsultentRoutes>
          <CourseDetailsPage />
        </ProtectedConsultentRoutes>
        } />
        <Route path='/profile/edit_details' element={<ProtectedConsultentRoutes>
          <EditCoursesPage />
        </ProtectedConsultentRoutes>
        } />
        <Route path="/consultent_new_password" element={
          <ProtectedConsultentRoutes>
            <ConfirmNewPasswordPage />
          </ProtectedConsultentRoutes>
        } />
        <Route path="/consultent_student" element={
          <ProtectedConsultentRoutes>
            <StudentPage />
          </ProtectedConsultentRoutes>
        } />
        <Route path="/view_student_profile" element={
          <ProtectedConsultentRoutes>
            <StudentProfilePage />
          </ProtectedConsultentRoutes>
        } />
        <Route path="/consultent_chat" element={
          <ProtectedConsultentRoutes>
            <ConsultentChatPage />
          </ProtectedConsultentRoutes>
        } />
      </Routes>
    </div>
  )
}

export default ConsultentRoutes
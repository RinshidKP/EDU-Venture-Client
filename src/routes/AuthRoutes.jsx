
import { Routes, Route } from 'react-router-dom';
import SignupPage from '../pages/SignupPage.jsx';
import StudentHomePage from '../pages/Student/StudentHomePage.jsx';
import LoginPage from '../pages/LoginPage';
import ProtectedAuthRoutes from '../helpers/ProtectedAuthRoutes.jsx';
import ForgotPasswordPage from '../pages/ForgotPasswordPage.jsx';




const AuthRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={
          <ProtectedAuthRoutes>
            <LoginPage />
          </ProtectedAuthRoutes>
        } />

        <Route path="/signup" element={
          <ProtectedAuthRoutes>
            <SignupPage />
          </ProtectedAuthRoutes>
        } />

        <Route path="/forgot_password" element={
          <ForgotPasswordPage />
        } />

        <Route path="/" element={<StudentHomePage />} />
      </Routes>
    </div>
  )
}

export default AuthRoutes

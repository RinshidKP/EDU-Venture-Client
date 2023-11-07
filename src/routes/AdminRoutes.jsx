import { Routes,Route } from "react-router-dom"
import AdminHomePage from "../pages/Admin/AdminHomePage"
import ProtectedAdminRoutes from "../helpers/protectedAdminRoutes"
import AdminCoursePage from "../pages/Admin/AdminCoursePage"
import AdminCountries from "../pages/Admin/AdminCountries"
const AdminRoutes = () => {
  return (
    <div className='bg-gradient-to-bl from-gray-400 to-slate-600'>
      <Routes>
        <Route path="/dashboard" element={
          <ProtectedAdminRoutes>
            <AdminHomePage/>            
          </ProtectedAdminRoutes>
        }/>
        <Route path="/dashboard_courses" element={
          <ProtectedAdminRoutes>
            <AdminCoursePage/>            
          </ProtectedAdminRoutes>
        }/>
        <Route path="/dashboard_countries" element={
          <ProtectedAdminRoutes>
            <AdminCountries/>  
          </ProtectedAdminRoutes>
        }/>
      </Routes>
    </div>
  )
}

export default AdminRoutes

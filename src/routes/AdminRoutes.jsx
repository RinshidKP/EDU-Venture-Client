import { Routes,Route } from "react-router-dom"
import AdminHomePage from "../pages/Admin/AdminHomePage"
import ProtectedAdminRoutes from "../helpers/ProtectedAdminRoutes.jsx"
import AdminCountries from "../pages/Admin/AdminCountries"
import AdminConsultencencies from "../pages/Admin/AdminConsultencencies"
import AdminStudentsPage from "../pages/Admin/AdminStudentsPage"
const AdminRoutes = () => {
  return (
    <div className='bg-gradient-to-bl from-gray-400 to-slate-600'>
      <Routes>
        <Route path="/dashboard" element={
          <ProtectedAdminRoutes>
            <AdminHomePage/>            
          </ProtectedAdminRoutes>
        }/>
        <Route path="/dashboard_countries" element={
          <ProtectedAdminRoutes>
            <AdminCountries/>  
          </ProtectedAdminRoutes>
        }/>
        <Route path="/dashboard_consultencies" element={
          <ProtectedAdminRoutes>
            <AdminConsultencencies/>  
          </ProtectedAdminRoutes>
        }/>
        <Route path="/dashboard_students" element={
          <ProtectedAdminRoutes>
            <AdminStudentsPage/>  
          </ProtectedAdminRoutes>
        }/>
      </Routes>
    </div>
  )
}

export default AdminRoutes

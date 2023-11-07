import './App.css'
import AdminRoutes from './routes/AdminRoutes';
import AuthRoutes from './routes/AuthRoutes.jsx'
import ConsultentRoutes from './routes/ConsultentRoutes';
import StudentRoutes from './routes/StudentRoutes';


function App() {

  return (
    <>
      <AuthRoutes/>
      <StudentRoutes/>
      <ConsultentRoutes/>
      <AdminRoutes/>
    </>
  )
}

export default App

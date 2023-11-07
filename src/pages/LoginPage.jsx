import RightSide from '../components/Auth/RightSide.jsx'
import Login from '../components/login/Login.jsx'

const LoginPage = () => {
  return (
<div className="flex flex-col h-screen sm:flex-row">
  <div className="w-full  sm:w-1/2">
    <RightSide />
  </div>
  <div className="w-full  sm:w-1/2">
    <Login />
  </div>
</div>

  )
}

export default LoginPage

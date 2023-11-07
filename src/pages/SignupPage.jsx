import RightSide from '../components/Auth/RightSide.jsx'
import Create from '../components/Signup/Create.jsx'


const SignupPage = () => {
  return (
    <div className="flex h-screen">
    <div className="w-1/2">
      <RightSide />
    </div>
    <div className="w-1/2">
      <Create />
    </div>  
  </div>
  )
}

export default SignupPage

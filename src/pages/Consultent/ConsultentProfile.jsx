import Profile from '../../components/Consultent/Profile'
import Courselist from '../../components/Course/Courselist'
import ConsultentNavbar from '../../components/Layout/ConsultentNavbar'

const ConsultentProfile = () => {
  return (
    <div>
      <ConsultentNavbar/>
      <Profile/>
      <Courselist/>
    </div>
  )
}

export default ConsultentProfile

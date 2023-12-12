import { useState } from 'react';
import { showErrorToast,ToastContainer } from '../../helpers/toaster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { consultentApi, studentAPI } from '../../apiRoutes/studentAPI';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Form from './Form';
import { userLogin } from '../../Redux/Client';

const Login = () => {
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = useState(true);
  const navigate = useNavigate();
  
  const handleToggleChange = () => {
    setIsChecked(!isChecked);
  };

  const handleUserSubmit = (userData) => {

      if(!userData.email||!userData.password){
        showErrorToast('Please Enter Data')
      }
      const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if (!emailPattern.test(userData.email)) {
        showErrorToast('Enter Valid Email')
      }
      studentAPI.post('/login',userData).then((response)=>{
        showErrorToast(response.data.message)
        console.log(response);
        if(response.data.user.isVerified){
          dispatch(
            userLogin({
              token: response.data.token,
              role: response.data.role,
              username: response.data.user.full_name,
              image: response.data.user.profile_picture,
              email: response.data.user.email ,
              id:  response.data.user._id,
            })
          )
        }
        console.log(response.data.user.isAdmin)
        if(response.data.user.isAdmin){
          navigate('/dashboard')
        }else{
          navigate('/')
        }
      }).catch((error)=>{
        console.log(error.message,error)
        showErrorToast(error.response?.data?.message)
      })
  }

  const handleConsultencySubmit = (userData) => {
    console.log('userData',userData);
    if(!userData.email||!userData.password){
      showErrorToast('Please Enter Data')
    }
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailPattern.test(userData.email)) {
      showErrorToast('Enter Valid Email')
    }
    consultentApi.post('/login',userData).then((response)=>{
      showErrorToast(response.data.message)
      if(response.data.user.isVerified){
        dispatch(
          userLogin({
            token: response.data.token,
            role: response.data.role,
            username: response.data.user.consultancy_name,
            image: response.data.user.profile_image,
            email: response.data.user.email,
            id:  response.data.user._id,
          })
        )
      }
      navigate('/consultent')
    }).catch((error)=>{
      console.log('not now',error)
      showErrorToast(error.response?.data?.message)
    })
  }

  return (
    <div>
  {/* Left Side (Create Form) */}
  <div className="md:h-screen p-4 flex items-center justify-center bg-emerald-800">
    <div className="w-auto h-auto p-5 mt-5 mb-5">
      <div className="custom-checkbox-container flex items-center justify-center mb-4 sm:mb-8">
        <label htmlFor="Toggle3" className="inline-flex items-center p-2 rounded-md cursor-pointer dark:text-gray-800">
          <input
            id="Toggle3"
            type="checkbox"
            className="hidden peer"
            checked={isChecked}
            onChange={handleToggleChange}
          />
          <span
            className={`px-4 py-2 rounded-l-md cursor-pointer ${isChecked ? 'bg-emerald-400' : 'bg-gray-300'}`}
          >
            <FontAwesomeIcon icon={faUser} /> User
          </span>
          <span
            className={`px-4 py-2 rounded-r-md cursor-pointer ${isChecked ? 'bg-gray-300' : 'bg-emerald-400'}`}
          >
            <FontAwesomeIcon icon={faBuilding} /> Consultancy
          </span>
        </label>
      </div>

      {/* Form component with submit handler for creating */}
      {isChecked ? (
        <Form handleSubmit={handleUserSubmit} isUserForm={isChecked} />
      ) : (
        <Form handleSubmit={handleConsultencySubmit} isUserForm={isChecked} />
      )}
    </div>
  </div>
  <ToastContainer />
</div>

  );
};

export default Login;

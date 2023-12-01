import {useState} from 'react';
import { showErrorToast ,showToast, ToastContainer } from '../../helpers/toaster';
import { useNavigate } from 'react-router-dom';
import Form from './Form';
import {  studentAPI } from '../../apiRoutes/studentAPI';
import OtpValidation from './OtpValidation';

function Create() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate()




  const handleCreate = (userData) => {

      studentAPI.post('/signup', userData)
      .then((response) => {
        if(response.data.error){
          showErrorToast(response.data.error)
          return
        }
        if (response.status) {
          setFormSubmitted(true);
          console.log(response.data);
          setUser(response.data)
        } else {
          console.error(response.error);
        }
      })
      .catch((error) => {
        console.log(error);
        showErrorToast(error)
      });
  
  };

  const resendOtp = () => {
studentAPI
      .post('/resend_otp', {email: user.email})
      .then((response) => {
        if (response.status === 200) {
          console.log(response);
          showToast(response.data.message);
        } else if (response.data.error) {
          console.log(response);
          showErrorToast(response.data.error || 'An error occurred.');
        } else {
          console.error(response);
          showErrorToast(response.data.error || 'An error occurred.');
        }
      })
      .catch((error) => {
        console.error(error);
        showErrorToast('An error occurred while processing your request.');
      });
  };
  

  const handleSubmitOtp = (otp) => {
    console.log(otp);
  
    studentAPI.post('/otpvalidate', { email: user.email, otp })
      .then((response) => {
        if (response.status === 200) {
          navigate('/');
        } else if (response.status === 400) {
          showErrorToast('Invalid Data: The request was malformed.');
        } else if (response.status === 404) {
          showErrorToast('User not found');
        } else if (response.status === 401) {
          showErrorToast('The OTP has expired.');
        } else {
          showErrorToast(response.data);
        }
      })
      .catch((error) => {
        showErrorToast(error.response.data.error);
        showErrorToast(error.data);
        console.error(error.response.data.error);
      });
  };
  

  return (
    <div>
      {/* Left Side (Create Form) */}
      <div className="h-screen p-4 flex items-center justify-center bg-emerald-800">
        <div className=" p-5 mt-5 mb-5">
          {/* Form component with submit handler for creating */}
          {formSubmitted ? ( 
                  <OtpValidation buttonText="Enter OTP" handleSubmitOtp={handleSubmitOtp} user resendOtp={resendOtp} />
                  ) : (
                  <Form buttonText="Signup" handleSubmit={handleCreate}   />
          )}
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
}

export default Create;

import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBuilding } from "@fortawesome/free-solid-svg-icons";
import { showErrorToast, ToastContainer } from "../../helpers/toaster";
import { consultentApi, studentAPI } from "../../apiRoutes/studentAPI";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userLogin } from "../../Redux/Client";

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [isChecked, setIsChecked] = useState(true);
    const [otpSend, setOtpSend] = useState(false);
    const [otp,setOtp] = useState('')
  const handleInputChange = (e) => {
    setEmail(e.target.value)
  };

  const handleToggleChange = () => {
    setIsChecked(!isChecked);
  };
  const handleOtpChange = (e) => {
    setOtp(e.target.value)
  }

  const handleSubmitForm = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      showErrorToast("Please provide your email.");
      return;
    }
  
    if (isChecked) {
      studentAPI
        .post('/forgot_password', { email })
        .then((response) => {
          if(response.status===200){
            console.log(response.status);
            setOtpSend(true)

          }
          console.log('Password reset email sent to user:', response.data);
        })
        .catch((error) => {
          showErrorToast(error.response.data.message)
          console.error('Error sending password reset email:', error);
        });
    } else {
      consultentApi
        .post('/forgot_password', { email })
        .then((response) => {
            setOtpSend(true)
          console.log('Password reset email sent to consultant:', response.data);
        })
        .catch((error) => {
          // Handle error
          showErrorToast(error.response.data.message)
          console.error('Error sending password reset email:', error);
        });
    }
  };

  const handleSubmit =(e)=>{
    e.preventDefault();

if (isChecked) {
    studentAPI
      .post('/otpvalidate', { email,otp })
      .then((response) => {
          console.log(response);
          if(response.data.user){
              dispatch(
                  userLogin({
                      token: response.data.token,
                      role: response.data.role,
                      username: response.data.user.full_name,
                      email: response.data.user.email
                    })
                    )
                    navigate('/new_password')
            // navigate(`/new_password?${queryString.stringify(response.data.user)}`);
            }else{
              showErrorToast(response.data.message)
            }
        showErrorToast(response.data.message)
                
        console.log('Response',response);
      })
      .catch((error) => {
        showErrorToast(error)
        console.error('Error sending password reset email:', error);
      });
  } else {
    consultentApi
    .post('/otpvalidate', { email,otp })
    .then((response) => {
        if(response.data.user.isVerified){
            dispatch(
                userLogin({
                    token: response.data.token,
                    role: response.data.role,
                    username: response.data.user.consultancy_name,
                    email: response.data.user.email
                })
                )
                navigate('/consultent_new_password')
                // navigate(`/new_password?${queryString.stringify(response.data.user)}`);
            }
            showErrorToast(response.data.message)
            console.log('Response',response);
      })
      .catch((error) => {
        showErrorToast(error)
        console.error('Error sending password reset email:', error);
      });
  }

  }
  

  return (
    <div className="bg-green-100 h-screen flex flex-col items-center justify-center">
      {!otpSend&&<div className="custom-checkbox-container flex items-center justify-center mb-4 sm:mb-8">
        <label
          htmlFor="Toggle3"
          className="inline-flex items-center p-2 rounded-md cursor-pointer dark:text-gray-800"
        >
          <input
            id="Toggle3"
            type="checkbox"
            className="hidden peer"
            checked={isChecked}
            onChange={handleToggleChange}
          />
          <span
            className={`px-4 py-2 rounded-l-md cursor-pointer ${
              isChecked ? "bg-emerald-200" : "bg-gray-300"
            }`}
          >
            <FontAwesomeIcon icon={faUser} /> User
          </span>
          <span
            className={`px-4 py-2 rounded-r-md cursor-pointer ${
              isChecked ? "bg-gray-300" : "bg-emerald-200"
            }`}
          >
            <FontAwesomeIcon icon={faBuilding} /> Consultancy
          </span>
        </label>
      </div>}
      {otpSend ? 
      <form className="bg-green-100 rounded shadow-md p-8" onSubmit={handleSubmit}>
      <h2 className="text-2xl text-dark mb-4">Enter Otp</h2>
      <div className="mb-1">
        <TextField
          fullWidth
          label="Enter OTP"
          variant="outlined"
          size="small"
          sx={{ width: '100%' }}
          InputLabelProps={{ style: { fontSize: '14px' }}}
          InputProps={{ style: { fontSize: '14px' }}}
          type="text"
          value={otp}
          onChange={handleOtpChange}
        />
      </div>
      <div className='flex justify-center mb-1'>
      </div>
      <div className="flex justify-center">
        <Button
          type="submit"
          variant="contained"
          style={{
            backgroundColor: 'teal',
            color: 'white',
            padding: '10px 20px',
          }}
        >
          Submit OTP
        </Button>
      </div>
    </form>
      :(
      <form className="rounded shadow-md p-8" onSubmit={handleSubmitForm}>
        <div className="text-center">
          <h1 className="text-3xl text-dark font-bold mb-5">
            Forgot Password
            <FontAwesomeIcon icon={faUser} />
          </h1>
        </div>
        <div className="mb-4">
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            size="small"
            sx={{ width: "100%" }}
            InputLabelProps={{ style: { fontSize: "14px" }}}
            InputProps={{ style: { fontSize: "14px" }}}
            placeholder="Email"
            name="email"
            value={email}
            onChange={handleInputChange}
          />
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            variant="contained"
            style={{
              backgroundColor: "teal",
              color: "white",
              padding: "10px 20px",
            }}
          >
            Send Reset Email
          </Button>
        </div>
      </form>)}
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;

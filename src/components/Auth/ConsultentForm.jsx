import { useState } from 'react';
import { TextField, Button, InputAdornment } from '@mui/material';
import { showErrorToast, showToast, ToastContainer } from '../../helpers/toaster';
import { consultentApi } from '../../apiRoutes/studentAPI';
import OtpValidation from '../Signup/OtpValidation';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
function ConsultentForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [title, setTitle] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [showPassword,setShowPassword] = useState(true);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleRepeatPasswordChange = (e) => {
    setRepeatPassword(e.target.value);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()||!title.trim()||!username.trim()) {
      showErrorToast('Please fill in all fields.');
      return;
    }

    const consultentData = {
      consultancy_name: username,
      email: email,
      title,
      password: password,
    };

    consultentApi
      .post('/signup', consultentData)
      .then((response) => {
        if (response.data.error) {
          showErrorToast(response.data.error);
          return;
        }
        if (response.status===201) {
          console.log(response.data);
          setFormSubmitted(true);
          
        } else {
          console.error(response.error);
        }
      })
      .catch((error) => {
        console.log(error);
        showErrorToast(error);
      });

  };

  const handleSubmitOtp = (otp) => {
    console.log(otp);
  
    consultentApi.post('/otpvalidate', { email: email, otp })
      .then((response) => {
        if (response.status === 200) {
          showToast('Admin Will Contact After Validation')
          setFormSubmitted(!formSubmitted);
            navigate('/login');
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

  const resendOtp = () => {
    consultentApi
      
          .post('/resend_otp',{ email: email })
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

  return (
    <div>
      {/* Form structure */}
      {formSubmitted ? ( 
                  <OtpValidation buttonText="Enter OTP" handleSubmitOtp={handleSubmitOtp} user resendOtp={resendOtp} />)
                  :(
        <form className="bg-green-100 rounded mt-2 shadow-md p-8" onSubmit={handleSubmitForm}>
        <div className="text-center ">
          <h1 className="text-3xl text-dark font-bold mb-5">Join us as Partners</h1>
        </div>
        <div className="mb-4">
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            size="small"
            InputLabelProps={{ style: { fontSize: '14px' } }}
            InputProps={{ style: { fontSize: '14px' }}}
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div className="mb-4">
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            size="small"
            InputLabelProps={{ style: { fontSize: '14px' } }}
            InputProps={{ style: { fontSize: '14px' }}}
            placeholder="Email"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div className="mb-4">
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            size="small"
            InputLabelProps={{ style: { fontSize: '14px' } }}
            InputProps={{ style: { fontSize: '14px' }}}
            placeholder="Email"
            value={title}
            onChange={handleTitleChange}
          />
        </div>

        <div className="mb-4">
          <TextField
            fullWidth
            label="Password"
            type={showPassword?"password":"text"}
            variant="outlined"
            size="small"
            InputLabelProps={{ style: { fontSize: '14px' } }}
            // InputProps={{ style: { fontSize: '14px' }}}
            InputProps={{
              style: { fontSize: '16px' },
              endAdornment: (
                <InputAdornment position="end">
                  <FontAwesomeIcon onClick={()=>setShowPassword(!showPassword)} className='cursor-pointer' icon={showPassword ?faEyeSlash : faEye} style={{ fontSize: '24px' }} />
                </InputAdornment>
              ),
            }}
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <div className="mb-4">
          <TextField
            fullWidth
            label="Repeat Password"
            type={showPassword?"password":"text"}
            variant="outlined"
            size="small"
            InputLabelProps={{ style: { fontSize: '14px' } }}
            // InputProps={{ style: { fontSize: '14px' }}}
            InputProps={{
              style: { fontSize: '16px' },
              endAdornment: (
                <InputAdornment position="end">
                  <FontAwesomeIcon onClick={()=>setShowPassword(!showPassword)} className='cursor-pointer' icon={showPassword ?faEyeSlash : faEye} style={{ fontSize: '24px' }} />
                </InputAdornment>
              ),
            }}
            placeholder="Password"
            value={repeatPassword}
            onChange={handleRepeatPasswordChange}
          />
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
            Apply
          </Button>
        </div>
      </form>)}
      <ToastContainer />
    </div>
  );
}

export default ConsultentForm;

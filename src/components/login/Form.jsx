import { useState } from 'react';
import { TextField, Button, InputAdornment } from "@mui/material";
import { showErrorToast, ToastContainer } from '../../helpers/toaster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBuilding ,faEye ,faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function Form({  handleSubmit, isUserForm }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword,setShowPassword] = useState(true);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    // Validation and API call logic
    if (!email.trim() || !password.trim()) {
      showErrorToast('Please fill in all fields.');
      return;
    }

    const userData = {
      email,
      password,
    };

    handleSubmit(userData);
  };

  return (
    <div>
  {/* Form structure */}
  <form className="bg-green-100 rounded mt-10 p-8 mx-auto w-full sm:w-auto md:w-full lg:w-2/3 xl:w-auto shadow-md" onSubmit={handleSubmitForm}>
    <div className="text-center mt-5">
      <h1 className="text-4xl text-dark font-bold mb-5">
        <span>Sign In </span>
        {isUserForm ? (
          <FontAwesomeIcon icon={faUser} />
        ) : (
          <FontAwesomeIcon icon={faBuilding} />
        )}
      </h1>
    </div>
    <div className="mb-5">
      <TextField
        fullWidth
        label="Email"
        variant="outlined"
        size="large"
        sx={{ width: '100%' }}
        InputLabelProps={{ style: { fontSize: '16px' }}}
        InputProps={{ style: { fontSize: '16px' }}}
        placeholder="Email"
        value={email}
        onChange={handleEmailChange}
      />
    </div>
    <div className="mb-4 flex">
      <TextField
        fullWidth
        label="Password"
        type={showPassword?"password":"text"}
        variant="outlined"
        size="large"
        sx={{ width: '100%' }}
        InputLabelProps={{ style: { fontSize: '16px' }}}
        // InputProps={{ style: { fontSize: '16px' }}}
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
        InputProps={{
          style: { fontSize: '16px' },
          endAdornment: (
            <InputAdornment position="end">
              <FontAwesomeIcon onClick={()=>setShowPassword(!showPassword)} className='cursor-pointer' icon={showPassword ?faEyeSlash : faEye} style={{ fontSize: '24px' }} />
            </InputAdornment>
          ),
        }}
      />
      {/* <div onClick={()=>setShowPassword(!showPassword)} className='flex items-center'>
      <FontAwesomeIcon icon={showPassword ?faEyeSlash : faEye} style={{ fontSize: '24px' }} />
    </div> */}
    </div>
    {isUserForm ?
    <div className="flex justify-center mb-2">Don't have an account<span style={{ cursor: 'pointer' }} onClick={() => navigate(`/signup`)} className='ml-2'> Sign up</span></div>
    : ( <><br className='flex justify-center mb-2' /></> )}
    <div className="flex justify-start mb-2"><span style={{ cursor: 'pointer' }} onClick={() => navigate(`/forgot_password`)} className='ml-2'>Forgot Password</span></div>
    <div className="flex justify-center">
      <Button
        type="submit"
        variant="contained"
        style={{
          backgroundColor: 'teal',
          color: 'white',
          padding: '12px 24px',
          fontSize: '18px',
        }}
      >
        Login
      </Button>
    </div>
  </form>
  <ToastContainer />
</div>

  
  );
}

export default Form;

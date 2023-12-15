import { useState } from 'react';
import { TextField, Button } from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { showErrorToast, ToastContainer } from '../../helpers/toaster';
import { useNavigate } from 'react-router-dom';

function Form({ buttonText, handleSubmit, isUserForm }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRepeatPasswordChange = (e) => {
    setRepeatPassword(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    // Validation and API call logic
    if (!username.trim() || !email.trim() || !password.trim()) {
      showErrorToast('Please fill in all fields.');
      return;
    }
    if (password !== repeatPassword) {
      showErrorToast('Passwords do not match.');
      return;
    }

    const userData = {
      full_name: username,
      email,
      password,
    };

    handleSubmit(userData);
  };

  return (
    <div>
      {/* Form structure */}
      <form className="bg-green-100 rounded shadow-md p-8" onSubmit={handleSubmitForm}>
        <div className="text-center ">
          <h1 className="text-3xl text-dark font-bold mb-5">
            {buttonText}
            {isUserForm ? (
              <FontAwesomeIcon icon={faUser} />
            ) : (
              <FontAwesomeIcon icon={faBuilding} />
            )}</h1>
        </div>
        <div className="mb-4">
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            size="small"
            sx={{ width: '100%' }}
            InputLabelProps={{ style: { fontSize: '14px' } }}
            InputProps={{ style: { fontSize: '14px' } }}
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
            sx={{ width: '100%' }}
            InputLabelProps={{ style: { fontSize: '14px' } }}
            InputProps={{ style: { fontSize: '14px' } }}
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div className="mb-4">
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            size="small"
            sx={{ width: '100%' }}
            InputLabelProps={{ style: { fontSize: '14px' } }}
            InputProps={{ style: { fontSize: '14px' } }}
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <div className="mb-4">
          <TextField
            fullWidth
            label="Repeat Password"
            type="password"
            variant="outlined"
            size="small"
            sx={{ width: '100%' }}
            InputLabelProps={{ style: { fontSize: '14px' } }}
            InputProps={{ style: { fontSize: '14px' } }}
            placeholder="Repeat Password"
            value={repeatPassword}
            onChange={handleRepeatPasswordChange}
          />
        </div>

        <div className="flex justify-center mb-2" >Dont have an account<span style={{ cursor: 'pointer' }} onClick={() => navigate('/login')} className='ml-2'> Sign In</span></div>

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
            {buttonText}
          </Button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Form;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button } from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { showErrorToast, ToastContainer } from '../../helpers/toaster';

function OtpValidation({ buttonText, handleSubmitOtp, user, resendOtp }) {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(0);

  const handleResendClick = () => {
    setResendDisabled(true);

    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      setResendDisabled(false);
      setTimer(90);
    }, 90000);

    resendOtp();
  };

  useEffect(() => {
    if (timer <= 0) {
      setResendDisabled(false);
    }
  }, [timer]);

  if (!user) {
    showErrorToast('Something Went Wrong');
    navigate('/login');
  }

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSubmitOtp(otp);
  };

  return (
    <div className="md:mt-20">
      <form className="bg-green-100 rounded shadow-md p-8" onSubmit={handleSubmit}>
        <h2 className="text-2xl text-dark mb-4">{buttonText}</h2>
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
          {resendDisabled ? (
            <p>Resend OTP in {timer}</p>
          ) : (
            <span className="" onClick={handleResendClick} disabled={resendDisabled}>
              <FontAwesomeIcon icon={faEnvelope} /> Resend OTP
            </span>
          )}
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
      <ToastContainer />
    </div>
  );
}

export default OtpValidation;

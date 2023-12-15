import { faEye, faEyeSlash, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, InputAdornment, TextField } from '@mui/material'
import { useState } from 'react'
import { showErrorToast } from '../../helpers/toaster'
import { useSelector } from 'react-redux'
import { consultentApi, studentAPI } from '../../apiRoutes/studentAPI'
import { useNavigate } from 'react-router-dom'


const ConfirmNewPassword = () => {

    const navigate = useNavigate()
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [showPassword, setShowPassword] = useState(true);

    const { Token, Role } = useSelector((state) => state.User);

    const handleSubmitForm = (e) => {
        e.preventDefault()
        if (!password.trim() || !repeatPassword.trim()) {
            showErrorToast('Enter a valid Password')
            return
        }

        if (password !== repeatPassword) {
            // Handle passwords not matching
            showErrorToast('Passwords not matching')
            return
        }

        if (Role === 'student') {
            console.log(password);
            studentAPI
                .post('/new_password', { password }, {
                    headers: {
                        'Authorization': Token,
                        'userRole': Role,
                    },
                })
                .then((response) => {
                    if (response.data) {
                        navigate('/profile');
                    }
                })
                .catch((error) => {
                    showErrorToast(error)
                })
        } else if (Role === 'consultent') {
            consultentApi
                .post('/new_password', { password }, {
                    headers: {
                        'Authorization': Token,
                        'userRole': Role,
                    },
                })
                .then((response) => {
                    if (response.data) {
                        navigate('/profile');
                    }
                })
                .catch((error) => {
                    showErrorToast(error)
                })
        } else {
            showErrorToast("Something Went Wrong")
        }
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }
    const handleRepeatPasswordChange = (e) => {
        setRepeatPassword(e.target.value)
    }
    return (
        <div className="bg-green-100 h-screen flex flex-col items-center justify-center">
            <div className="bg-green-100 h-screen flex flex-col items-center justify-center">
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
                            label="Password"
                            variant="outlined"
                            size="small"
                            sx={{ width: "100%" }}
                            InputLabelProps={{ style: { fontSize: "14px" } }}
                            // InputProps={{ style: { fontSize: "14px" } }}
                            placeholder="Password"
                            name="Password"
                            type={showPassword ? "password" : "text"}
                            value={password}
                            onChange={handlePasswordChange}
                            InputProps={{
                                style: { fontSize: '16px' },
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <FontAwesomeIcon onClick={() => setShowPassword(!showPassword)} className='cursor-pointer' icon={showPassword ? faEyeSlash : faEye} style={{ fontSize: '24px' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                    <div className="mb-4">

                        <TextField
                            fullWidth
                            label="Repeat Password"
                            variant="outlined"
                            size="small"
                            sx={{ width: "100%" }}
                            InputLabelProps={{ style: { fontSize: "14px" } }}
                            // InputProps={{ style: { fontSize: "14px" } }}
                            placeholder="Repeat Password"
                            name="RepeatPassword"
                            type={showPassword ? "password" : "text"}
                            value={repeatPassword}
                            onChange={handleRepeatPasswordChange}
                            InputProps={{
                                style: { fontSize: '16px' },
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <FontAwesomeIcon onClick={() => setShowPassword(!showPassword)} className='cursor-pointer' icon={showPassword ? faEyeSlash : faEye} style={{ fontSize: '24px' }} />
                                    </InputAdornment>
                                ),
                            }}
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
                </form>
            </div>
        </div>
    )
}

export default ConfirmNewPassword

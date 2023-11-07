import React, { useEffect, useState } from 'react';
import { baseImageUrl } from '../../config/apiURL';
import { useLocation, useNavigate } from 'react-router-dom';
import defaultImage from '../../assets/download.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { ToastContainer, showErrorToast, showToast } from '../../helpers/toaster';
import { consultentApi } from '../../apiRoutes/studentAPI';
import { useSelector } from 'react-redux';
import queryString from 'query-string';

const StudentProfile = () => {

    const [userData, setUserData] = useState({});
    const [course, setCourse] = useState({});
    const [selectedValue, setSelectedValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const {Token , Role} = useSelector((state)=>state.User);
    const [selectOptions,setSelectOptions] = useState([
        { value: 'Accepted', label: 'Accept' },
        { value: 'Decline', label: 'Decline' },
        { value: 'InitiatePayment', label: 'Initiate Payment' },
    ])
    const location = useLocation();
    const navigate = useNavigate()
    const { state: studentData } = location;
    const [application,setApplication]=useState(studentData)

    useEffect(() => {
        setCourse(application.course);
        console.log(application);
        setUserData(application.student);
        setSelectedValue(
          application.status
        );
      }, [application]);

      
      useEffect(() => {
          const options = [
            { value: 'Accepted', label: 'Accept' },
            { value: 'Decline', label: 'Decline' },
            { value: 'InitiatePayment', label: 'Initiate Payment' },
            ]
        const filteredOptions = options.filter((option) => {
          if (selectedValue === 'Accepted') {
            return option.value === 'InitiatePayment';
          } else if (selectedValue === 'Decline') {
            return option.value !== 'Decline'&&option.value !== 'InitiatePayment';
          } else if (selectedValue === 'InitiatePayment') {
            return option.value === 'Decline';
          } else {
            return option.value !== 'InitiatePayment';
          }
        });
        setSelectOptions(filteredOptions);
      },[selectedValue]);     

    const selectOption = (option) => {

        setIsOpen(false);
        if (option.value === 'Accepted') {
            Swal.fire({
              title: 'Acceptance',
              text: 'You have accepted this option.',
              icon: 'success', 
              showCancelButton: true,
              confirmButtonText: 'OK',
              cancelButtonText: 'Cancel',
            }).then((result) => {
              if (result.isConfirmed) {
                consultentApi.post('/accept_candidate',{id:application._id},{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': Token,
                        'userRole': Role,
                        }
                }).then((response)=>{
                    console.log(response.data);
                    setApplication(response.data.studentData)
                    showToast(response.data.message);
                }).catch((error)=>{
                    showErrorToast(error.message)
                })
            //    showToast('Student Accepted')
               setSelectedValue(option.value);
              } else if (result.isDismissed && result.dismiss === Swal.DismissReason.cancel) {
                showToast('Task Cancelled')
                return
              }
            });
        } else if (option.value === 'Decline') {
            Swal.fire({
              title: 'Decline',
              text: 'You have declined this Request.',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'OK',
              cancelButtonText: 'Cancel',
            }).then((result) => {
              if (result.isConfirmed) {
                // Handle the decline action
                consultentApi.post('/decline_candidate',{id:application._id},{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': Token,
                        'userRole': Role,
                        }
                }).then((response)=>{
                    console.log(response.data);
                    setApplication(response.data.studentData)
                    showToast(response.data.message);
                }).catch((error)=>{
                    showErrorToast(error.message)
                })
                setSelectedValue(option.value);
              } else if (result.isDismissed && result.dismiss === Swal.DismissReason.cancel) {
                showToast('Task Cancelled');
                return
              }
            });
        }else if(option.value === 'InitiatePayment') {
            Swal.fire({
              title: 'Initiate Payment',
              text: 'You are about to initiate a payment for this Student.',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Initiate Payment',
              cancelButtonText: 'Cancel',
            }).then((result) => {
              if (result.isConfirmed) {
                // Handle the payment initiation action here
                // initiatePayment(); // Replace this with your payment initiation logic
                setSelectedValue(option.value);
              } else if (result.isDismissed && result.dismiss === Swal.DismissReason.cancel) {
                showToast('Payment Cancelled');
                return
              }
            });
          }else{
            console.log(option.value)
          }
    };

    return (
        <div>
            <nav style={{ backgroundColor: '#F3F8F9' }} className="cursor-pointer dark:bg-gray-800">
                <div className="container mx-auto">
                    <div className="border p-1 ">
                        <div className="flex items-center justify-center p-6 text-dark-600 capitalize dark:text-gray-300">
                            <h1 className="text-2xl">Profile</h1>
                        </div>
                    </div>
                </div>
            </nav>

            <section className="pt-16">
                <div className="container mx-auto">
                    <div className="bg-white bg-opacity-70 w-full shadow-xl rounded-lg p-6">
                        <div className="grid grid-cols-2 text-center my-auto w-full">
                            <div className=' col-1'>
                                <div className="flex justify-center">
                                    <img
                                        src={userData.profile_picture ? baseImageUrl + userData.profile_picture : defaultImage}
                                        alt="User Profile"
                                        className="avatar rounded-full h-60 w-60 border-4 border-white"
                                    />
                                </div>
                                <div className='flex justify-center'>
                                    <div className='items-center'>
                                        <h3 className="text-xl leading-normal mb-2">{userData.full_name || 'User Name'}</h3>
                                        <h5 className="text-xl leading-normal mb-2">{userData.email || 'User Email'}</h5>
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col justify-center items-start  col-2'>
                                <div className='flex justify-start '>
                                    <h1 className='items-center text-2xl mr-5'>
                                        Contact <span>  :</span>
                                    </h1>
                                    <button  onClick={()=>{navigate(`/consultent_chat?${queryString.stringify(userData)}`)}} className='flex items-center justify-center  border-2 border-black px-10 rounded-3xl'>
                                        <div className='items-end py-1'>
                                            <FontAwesomeIcon icon={faAddressCard} className="text-black text-3xl" />
                                        </div>
                                        <span className='text-center p-2'>
                                            Message Now
                                        </span>
                                    </button>
                                </div>
                                <div className='flex justify-center mt-5'>
                                    <h1 className='items-center text-2xl'>
                                        Select Action <span>  :</span>
                                    </h1>
                                    <div className="relative inline-block text-black ml-2">
                                        <input
                                            type="text"
                                            className="border-2 border-black px-10 py-2 rounded-3xl text-center cursor-pointer"
                                            value={selectOptions.find((option) => option.value === selectedValue)?.label || selectedValue ||'Select Action'}
                                            readOnly
                                            onClick={() => {setIsOpen(!isOpen)}}
                                        />
                                        {isOpen && (
                                            <div className="absolute mt-2 w-40 bg-white border border-black rounded-lg shadow-md">
                                                <ul>
                                                    {selectOptions.map((option) => (
                                                        <li
                                                            key={option.value}
                                                            className="px-4 py-2 cursor-pointer"
                                                            onClick={() => selectOption(option)}
                                                        >
                                                            {option.label}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="user-info">

                            <div className="flex items-center m-10 justify-center">
                                <h3 className="border text-2xl text-center border-green-800 w-3/4 py-3 bg-white-100">
                                    Course Applied : {course.header}
                                </h3>
                            </div>
                            <div className="flex items-center m-10 justify-center">
                                <h3 className="border text-2xl text-center border-green-800 w-3/4 py-3 bg-white-100">
                                    Rewards
                                </h3>
                            </div>
                            <div className="flex items-center m-10 justify-center">
                                <h3 className="border text-2xl text-center border-green-800 w-3/4 py-3 bg-white-100">
                                    Course Amount : {course.fee}
                                </h3>
                            </div>
                        </div>
                        <div className="input-group mb-3 w-75 mx-auto">
                            {/* Add any input fields or form elements here */}
                        </div>
                    </div>
                </div>
            </section>
            <ToastContainer/>
        </div>
    );
};

export default StudentProfile;

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import defaultImage from '../../assets/download.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { ToastContainer, showErrorToast, showToast } from '../../helpers/toaster';
import defaultPassport from '../../assets/download.png';
import queryString from 'query-string';
import { useConsultantInterceptor } from '../../customHooks/useConsultantInterceptor';

const StudentProfile = () => {

  const [userData, setUserData] = useState({});
  const [course, setCourse] = useState({});
  const [selectedValue, setSelectedValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [certificate, setCertificate] = useState({})
  const [selectOptions, setSelectOptions] = useState([
    { value: 'Accepted', label: 'Accept' },
    { value: 'Decline', label: 'Decline' },
    { value: 'InitiatePayment', label: 'Initiate Payment' },
  ])
  const location = useLocation();
  const navigate = useNavigate()
  const { state: studentData } = location;
  const [application, setApplication] = useState(studentData)
  const consultantAxios = useConsultantInterceptor();

  useEffect(() => {

    consultantAxios.get('/student_certificates', {
      params: { studentId: location.state.student._id }
    })
      .then((response) => {
        console.log(location.state.student._id);
        console.log(response);
        if (response.data.certificate === false) {
          setCertificate({})
        } else {
          setCertificate(response.data.certificate)
        }
      })
      .catch((error) => {
        console.error(error);
      })

    setCourse(application.course);
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
        return option.value !== 'Decline' && option.value !== 'InitiatePayment';
      } else if (selectedValue === 'InitiatePayment') {
        return option.value === 'Decline';
      } else {
        return option.value !== 'InitiatePayment';
      }
    });
    setSelectOptions(filteredOptions);
  }, [selectedValue]);

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
          consultantAxios
            .post('/accept_candidate',
              { id: application._id }
            ).then((response) => {
              console.log(response.data);
              setApplication(response.data.studentData)
              showToast(response.data.message);
            }).catch((error) => {
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
          consultantAxios.post('/decline_candidate',
            { id: application._id }
          ).then((response) => {
            console.log(response.data);
            setApplication(response.data.studentData)
            showToast(response.data.message);
          }).catch((error) => {
            showErrorToast(error.message)
          })
          setSelectedValue(option.value);
        } else if (result.isDismissed && result.dismiss === Swal.DismissReason.cancel) {
          showToast('Task Cancelled');
          return
        }
      });
    } else if (option.value === 'InitiatePayment') {
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
          consultantAxios.post('/intiatie_payement_option',
            { id: application._id }
          ).then((response) => {
            console.log(response.data);
            setApplication(response.data.studentData)
            showToast(response.data.message);
          }).catch((error) => {
            showErrorToast(error.message)
          })

          setSelectedValue(option.value);
        } else if (result.isDismissed && result.dismiss === Swal.DismissReason.cancel) {
          showToast('Payment Initialisation Cancelled');
          return
        }
      });
    } else {
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

      <section className="pt-5">
        <div className="container mx-auto">
          <div className="bg-white bg-opacity-70 w-full shadow-xl rounded-lg p-6">
            <div className="border border-black rounded py-5 grid grid-cols-1 md:grid-cols-2 text-center my-auto w-full">
              <div className='md:col-1'>
                <div className="flex justify-center">
                  <img
                    src={userData.profile_picture ? userData.profile_picture.url : defaultImage}
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
              <div className='md:flex md:flex-col md:justify-center md:items-start md:col-2'>
                <div className='flex justify-center md:justify-start'>
                  <h1 className='items-center text-2xl md:mr-5'>
                    Contact <span>  :</span>
                  </h1>
                  <button onClick={() => { navigate(`/consultent_chat?${queryString.stringify(userData)}`) }} className='flex items-center justify-center  border-2 border-black px-5 md:px-10 rounded-3xl'>
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
                      className="border-2 border-black px-5 md:px-10 py-2 rounded-3xl text-center cursor-pointer"
                      value={application.paymentStatus !== 'Pending' ? application.paymentStatus : selectOptions.find((option) => option.value === selectedValue)?.label || selectedValue || 'Select Action'}
                      readOnly
                      onClick={() => { setIsOpen(!isOpen) }}
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
                  {console.log('studentData', studentData)}
                  <span className='text-ellipsis' >Qualification : {studentData?.student?.qualification}</span>
                </h3>
              </div>
              <div className="flex items-center m-10 justify-center">
                <h3 className="border text-2xl text-center border-green-800 w-3/4 py-3 bg-white-100">
                  Course Amount : {course.fee}
                </h3>
              </div>
            </div>


            <div className='my-5 select-none w-full flex flex-col sm:flex-row items-center justify-center cursor-pointer'>
              <div className='my-5 select-none w-full flex flex-col sm:flex-row items-center justify-center cursor-pointer'>
                <div className="text-2xl rounded-lg text-center mx-1 w-full sm:w-3/4 border border-green-800">
                  <div className='py-3 bg-white-100'>
                    <h3 className='underline text-green-800 font-semibold'>Passport</h3>
                  </div>
                  <div className='flex justify-center'>
                    <div className='flex m-4 text-start flex-wrap sm:flex-nowrap'>
                      {/* First Column */}
                      <div className='text-xl flex flex-col my-2 mx-5'>
                        <h3 className='my-2 font-bold text-gray-700 p-1'>
                          Passport Name
                        </h3>
                        <h3 className='my-2 font-bold text-gray-700 p-1'>
                          Passport Number
                        </h3>
                        <h3 className='my-2 font-bold text-gray-700 p-1'>
                          Date Of Birth
                        </h3>
                      </div>

                      {/* Second Column */}
                      <div className='text-xl flex flex-col my-2 mx-5'>
                        <h3 className='my-2 rounded-lg border border-sky-500 p-1 text-gray-800'>
                          {certificate?.passport?.name || "Passport Name"}
                        </h3>
                        <h3 className='my-2 rounded-lg border border-sky-500 p-1 text-gray-800'>
                          {certificate?.passport?.passportNumber || "Passport Number"}
                        </h3>
                        <h3 className='my-2 rounded-lg border border-sky-500 p-1 text-gray-800'>
                          {certificate?.passport?.dateOfBirth
                            ? new Date(certificate.passport.dateOfBirth).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                            : "Date of birth"}
                        </h3>
                      </div>

                      {/* Third Column */}
                      <div className='text-xl flex flex-col my-2 mx-5'>
                        <h3 className='my-2 font-bold text-gray-700 p-1'>
                          Place Of Birth
                        </h3>
                        <h3 className='my-2 font-bold text-gray-700 p-1'>
                          Date Of Issue
                        </h3>
                        <h3 className='my-2 font-bold text-gray-700 p-1'>
                          Date Of Expiry
                        </h3>
                      </div>

                      {/* Fourth Column */}
                      <div className='text-xl flex flex-col my-2 mx-5'>
                        <h3 className='my-2 rounded-lg border border-sky-500 p-1 text-gray-800'>
                          {certificate?.passport?.placeOfBirth || " Place of birth"}
                        </h3>
                        <h3 className='my-2 rounded-lg border border-sky-500 p-1 text-gray-800'>
                          {certificate?.passport?.dateOfIssue
                            ? new Date(certificate.passport.dateOfIssue).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                            : "Date of Issue"}
                        </h3>
                        <h3 className='my-2 rounded-lg border border-sky-500 p-1 text-gray-800'>
                          {certificate?.passport?.dateOfExpiry
                            ? new Date(certificate.passport.dateOfExpiry).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                            : "Date of Expirey"}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className='m-5 flex justify-center '>
                    <img className='h-40 w-80 border rounded border-sky-800' src={certificate?.passport?.image_proof.url || defaultPassport} alt="" />
                  </div>
                </div>
              </div>
            </div>

            <div className='my-5 select-none w-full flex flex-col sm:flex-row items-center justify-center cursor-pointer'>
              <div className='my-5 select-none w-full flex flex-col sm:flex-row items-center justify-center cursor-pointer'>
                <div className="text-2xl rounded-lg text-center w-full sm:w-3/4 border border-green-800">
                  <div className='py-3 bg-white-100'>
                    <h3 className='underline text-green-800 font-semibold'>Certificates</h3>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-center">
                    {/* First Column */}
                    <div className='text-xl flex flex-col my-2 mx-5 sm:w-1/4'>
                      <h3 className='my-2 font-bold text-gray-700 p-1'>
                        Qualification Name
                      </h3>
                      <h3 className='my-2 font-bold text-gray-700 p-1'>
                        University Name
                      </h3>
                      <h3 className='my-2 font-bold text-gray-700 p-1'>
                        Joined Date
                      </h3>
                    </div>

                    {/* Second Column */}
                    <div className='text-xl flex flex-col my-2 mx-5 sm:w-1/4'>
                      <h3 className='my-2 rounded-lg border border-sky-500 p-1 text-gray-800'>
                        {certificate?.qualification?.qualificationName || 'Name'}
                      </h3>
                      <h3 className='my-2 rounded-lg border border-sky-500 p-1 text-gray-800'>
                        {certificate?.qualification?.universityName || 'University Name'}
                      </h3>
                      <h3 className='my-2 rounded-lg border border-sky-500 p-1 text-gray-800'>
                        {certificate?.qualification?.joinedDate
                          ? new Date(certificate.qualification.joinedDate).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                          : 'Date of Joining'}
                      </h3>
                    </div>

                    {/* Third Column */}
                    <div className='text-xl flex flex-col my-2 mx-5 sm:w-1/4'>
                      <h3 className='my-2 font-bold text-gray-700 p-1'>
                        Collage Name
                      </h3>
                      <h3 className='my-2 font-bold text-gray-700 p-1'>
                        Collage Address
                      </h3>
                      <h3 className='my-2 font-bold text-gray-700 p-1'>
                        Date Of Passing
                      </h3>
                    </div>

                    {/* Fourth Column */}
                    <div className='text-xl flex flex-col my-2 mx-5 sm:w-1/4'>
                      <h3 className='my-2 rounded-lg border border-sky-500 p-1 text-gray-800'>
                        {certificate?.qualification?.collegeName || 'College Name'}
                      </h3>
                      <h3 className='my-2 rounded-lg border overflow-ellipsis overflow-hidden  border-sky-500 p-1 text-gray-800'>
                        {certificate?.qualification?.collegeAddress || 'College Address'}
                      </h3>
                      <h3 className='my-2 rounded-lg border border-sky-500 p-1 text-gray-800'>
                        {certificate?.qualification?.dateOfPassing
                          ? new Date(certificate.qualification.dateOfPassing).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                          : 'Date of Passing'}
                      </h3>
                    </div>
                  </div>
                  <div className='m-5 flex justify-center '>
                    <img className='h-40 w-80 border rounded border-sky-800' src={certificate?.qualification?.image_proof.url || defaultPassport} alt="" />
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>


      <ToastContainer />
    </div>
  );
};

export default StudentProfile;

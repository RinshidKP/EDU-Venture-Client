import React, { useEffect, useState } from 'react';
import { studentAPI } from '../../apiRoutes/studentAPI';
import { useSelector } from 'react-redux';
import { showErrorToast } from '../../helpers/toaster';
import { baseImageUrl } from '../../config/apiURL';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'
const Applications = () => {
  const [applications, setApplications] = useState([]);
  const { Token, Role } = useSelector((state) => state.User);
  const navigate = useNavigate()
  useEffect(() => {
    studentAPI
      .get('/student_course', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: Token,
          userRole: Role,
        },
      })
      .then((response) => {
        console.log(response);
        if (response.status !== 200) {
          console.log(response.data);
        } else {
          setApplications(response.data.applications);
        }
      })
      .catch((error) => {
        showErrorToast(error.response.data.message);
      });
  }, [Token, Role]);

  return (
    <div className='w-full flex justify-center  items-center animate-flip-down'>
      <div className='w-5/6 bg-white py-10 shadow-lg flex flex-wrap justify-around'>

        {applications.length > 0 ? (
          applications.map((application, index) => (
            <div
              key={index}
              className='relative my-5 group/item group-hover bg-white w-1/4 m-2 p-6 transition-transform transform hover:scale-110 hover:translate-x-2 hover:translate-y-2 rounded-lg shadow-md flex flex-col justify-center items-center group-hover:shadow-lg'
            >
              <div className='flex-1 mb-1'>
                <h1 className="uppercase font-semibold tracking-wide text-lg">
                  {application.course?.header || 'Application'}
                </h1>
              </div>

              <div className='flex-1 mb-5'>
                <div className={application.status === 'Pending' ? 'text-blue-500' : 'text-red-500' || 'Application'}>
                  Status: {application.status || 'Application'}
                </div>
              </div>
              <div className='flex-1 mb-5'>
                <img src={baseImageUrl + application.course?.course_image || 'Application'} alt='' />
              </div>
              <button onClick={()=>navigate('/course_details',{ state: application })} className="absolute group/edit rounded-b bottom-0 bg-sky-900 text-white py-2 px-4 invisible group-hover/item:visible">
                <FontAwesomeIcon className='animate-bounce animate-ease-in' icon={faChevronDown} />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">
            No applications available.
          </div>
        )}


      </div>
    </div>
  );
};

export default Applications;

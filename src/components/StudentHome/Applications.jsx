import React, { useEffect, useState } from 'react';
import { showErrorToast } from '../../helpers/toaster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'
import { useStudentAxiosIntercepter } from '../../customHooks/useStudentAxiosIntercepter';
const Applications = () => {
  const [applications, setApplications] = useState([]);
  const studentAxios = useStudentAxiosIntercepter();
  const navigate = useNavigate()
  useEffect(() => {
    studentAxios
      .get('/student_course')
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
  }, []);

  return (
    <div className='w-full flex flex-col justify-center  items-center '>
      <div className='w-full h-auto flex justify-center py-10 bg-gray-200' >
        <h1 className='text-3xl' >Applications</h1>
      </div>
      <div className='w-5/6 bg-gray-50 py-10 shadow-lg my-10 flex flex-wrap justify-around'>

        {applications.length > 0 ? (
          applications.map((application, index) => (
            <div
              key={index}
              className=' animate-flip-down relative my-5 group/item group-hover bg-white w-1/4 m-2 p-6 transition-transform transform hover:scale-110 hover:translate-x-2 hover:translate-y-2 rounded-lg shadow-md flex flex-col justify-center items-center group-hover:shadow-lg'
            >
              <div className='flex-1 mb-1'>
                <h1 className="uppercase font-semibold tracking-wide text-lg">
                  {application.course?.header || 'Application'}
                </h1>
              </div>

              <div className='flex-1 mb-5'>
                <div className={application.status === 'Pending' ? 'text-blue-500' :application.status === 'Accepted' ? 'text-green-500': 'text-red-500' || 'Application'}>
                  Status: {application.paymentStatus !=="Pending" ? application.paymentStatus : application.status || 'Application'}
                </div>
              </div>
              <div className='flex-1 mb-5'>
                <img src={ application.course?.course_image.url || 'Application'} alt='' />
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

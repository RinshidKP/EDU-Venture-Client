import { useState, useEffect } from 'react';
import { baseImageUrl } from '../../config/apiURL';
import defaultImage from '../../assets/download.png';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { studentAPI } from '../../apiRoutes/studentAPI';
import { useSelector } from 'react-redux';
import { showToast,ToastContainer } from '../../helpers/toaster';
import Swal from 'sweetalert2';

const CourseDetails = () => {
  const [course, setCourse] = useState(null);
  const { Token, Role } = useSelector((state) => state.User);
  const location = useLocation();
  useEffect(() => {
    const queryParams = queryString.parse(location.search);
    setCourse(queryParams);
  }, [location.search]);

  const handleApply = () => {
    console.log(course._id);

      Swal.fire({
        title: 'Confirm Application',
        text: 'Are you sure you want to apply for this course?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Apply',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          const id = course._id;
          studentAPI
            .post('/apply_course', { id }, {
              headers: {
                'Authorization': Token,
                'userRole': Role,
              },
            })
            .then((response) => {
              console.log(response.data.message);
              showToast(response.data.message);
            });
        }
      });
    };
  
  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-screen-xl mx-auto p-6 bg-white rounded-md shadow-md">
        {course ? (
          <div>
            <div className="text-center">
              <h1 className="text-3xl font-semibold text-gray-800 mb-4">{course.header}</h1>
              <img
                className="rounded-lg shadow-lg mx-auto w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96"
                src={course.course_image ? baseImageUrl + course.course_image : defaultImage}
                alt="Course Image"
              />
            </div>

            <div className="mt-4">
              <div className="text-center">
                <p className="text-lg text-gray-600">Course Fee</p>
                <p className="text-2xl text-green-600 font-semibold">₹{course.fee}</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-center">
                <p className="text-gray-800">{course.short_blob}</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-center">
                <h2 className="text-lg text-gray-600">Students Qualification</h2>
                <p className="text-gray-800">{course.students_qualification_header}</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-center">
                <p className="text-gray-800">{course.qualification_description}</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-center">
                <h2 className="text-lg text-gray-600">Requirements</h2>
                <p className="text-gray-800">{course.requirements_header}</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-center">
                <h2 className="text-lg text-gray-600">Requirements Description</h2>
                <p className="text-gray-800">{course.requirements_blob}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <p className="my-auto text-2xl text-gray-800">Loading course details...</p>
          </div>
        )}

        <div className='flex items-center '>
          <button onClick={handleApply} className='mx-auto py-2 px-5 font-semibold rounded m-10 bg-teal-500'>
            Apply
          </button>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default CourseDetails;

import { useState, useEffect } from 'react';
import { baseImageUrl } from '../../config/apiURL';
import defaultImage from '../../assets/download.png';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { studentAPI } from '../../apiRoutes/studentAPI';
import { useSelector } from 'react-redux';
import { showToast, ToastContainer } from '../../helpers/toaster';
import Swal from 'sweetalert2';

const CourseDetails = () => {
  const [course, setCourse] = useState(null);
  const { Token, Role, Id } = useSelector((state) => state.User);
  const location = useLocation();
  const [applied,setApplied] = useState(false);
  const [country,setCountry] = useState(null)

  useEffect(() => {
    console.log(location.state.status);
    
    if (location.state?.course) {
      setCourse(location.state?.course);
      if (location.state?.status === 'Accepted'||location.state?.status === 'Pending') {
        setApplied(true);
      }      
      setCountry(location.state?.course.countryInfo||location.state?.course.country)
      const countryToSet = location.state?.course.countryInfo || location.state?.course.country;
      setCountry(countryToSet);

    } else {
      console.log('the state doesnt have value mister ');
      // studentAPI.get('/country_details',{
      //   params: {
      //     id :location.course._id
      //   },
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': Token,
      //     'userRole': Role
      //   }
      // })
    }
  }, [location]);

  useEffect(()=>{
      studentAPI.get('/student_application',{
        params: {
          courseID : location.state.course._id,
          studentID : Id,
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': Token,
          'userRole': Role
        }
      }).then((response)=>{
          // console.log(response.data);
          setApplied(response.data.applied)
        }).catch((error)=>{
        console.log(error.response.data);
      })
  },[location,Id,Token,Role])
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
            console.log(response);
            showToast(response.data.message);
            if(response.status===200){
              setApplied(true);
            }
          });
      }
    });
  };

  return (
    <div className="">

      <nav style={{ backgroundColor: '#F3F8F9' }} className="cursor-pointer dark:bg-gray-800">
        <div className="container mx-auto">
          <div className="border p-1 ">
            <div className="flex items-center justify-center p-6 text-dark-600 capitalize dark:text-gray-300">
              <h1 className='text-2xl'>Course Details</h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="w-full max-w-screen-xl mx-auto p-6 bg-white rounded-md shadow-md">
        {course ? (
          <div className="flex w-full justify-center md:flex-row">
            <div className='w-4/6 flex bg-gray-200 justify-content-center'>
              <div className='flex mx-auto my-10'>
                {/* Left Section */}
                <div className="w-full md:w-2/4 pr-6">
                  <div className="text-center">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-4">{course.header}</h1>
                    <img
                      className="rounded-lg shadow-lg mx-auto w-full md:w-64 h-64 md:h-80 lg:w-96 lg:h-96 border-4 border-gray-300"
                      src={course.course_image ? baseImageUrl + course.course_image : defaultImage}
                      alt="Course Image"
                    />

                  </div>
                </div>

                {/* Right Section */}
                <div className='flex mx-auto justify-content-center'>
                  <div className="flex flex-1 flex-col justify-center">
                    <div className="mt-4 items-start">
                      {/* Column 1 */}
                      <div className="md:w-1/3">
                        <div className="text-center md:text-left">
                          <p className="text-lg text-gray-600">Consultancy</p>
                          <p className="text-2xl text-green-600 capitalize font-semibold">
                            {course.creator?.consultancy_name}
                          </p>
                        </div>
                      </div>

                      {/* Column 2 */}
                      <div className="md:w-1/3">
                        <div className="text-center md:text-left">
                          <p className="text-lg text-gray-600">Country</p>
                          <p className="text-2xl text-green-600 flex justify-between items-center capitalize font-semibold">
                            {country.name}
                          </p>
                          <img className='object-cover object-center mx-3 w-5 h-5 rounded-full' src={baseImageUrl + country?.image} alt="" />
                        </div>
                      </div>

                      {/* Column 3 */}
                      <div className="md:w-1/3 mt-4 md:mt-0">
                        <div className="text-center md:text-left">
                          <p className="text-lg text-gray-600">Course Fee</p>
                          <p className="text-2xl text-green-600 font-semibold">₹{course.fee}</p>
                        </div>
                      </div>

                      {/* Apply Button */}
                      <div className='flex items-start justify-start mt-6'>
                        <button onClick={handleApply} disabled={applied !== false}  className='mx-start py-2 px-10 font-semibold rounded bg-emerald-500 text-white'>
                          {applied ? 'Applied' : 'Apply'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


        ) : (
          <div className="flex justify-center">
            <p className="my-auto text-2xl text-gray-800">Loading course details...</p>
          </div>
        )}

        {/* Other contents below the image and header */}
        <div className="mt-6">
          <div className="text-center">
            <h2 className="text-lg text-gray-600">Students Qualification</h2>
            <p className="text-gray-800">{course?.students_qualification_header}</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="text-center">
            <p className="text-gray-800">{course?.qualification_description}</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="text-center">
            <h2 className="text-lg text-gray-600">Requirements</h2>
            <p className="text-gray-800">{course?.requirements_header}</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="text-center">
            <h2 className="text-lg text-gray-600">Requirements Description</h2>
            <p className="text-gray-800">{course?.requirements_blob}</p>
          </div>
        </div>

        {/* Button */}

      </div>
      <ToastContainer />
    </div>

  );
};

export default CourseDetails;

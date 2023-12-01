import { useState, useEffect } from 'react';
import defaultImage from '../../assets/download.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { showToast, ToastContainer } from '../../helpers/toaster';
import Swal from 'sweetalert2';
import { useStudentAxiosIntercepter } from '../../customHooks/useStudentAxiosIntercepter';
import { loadStripe } from '@stripe/stripe-js';

const CourseDetails = () => {
  const navigate= useNavigate()
  const [course, setCourse] = useState(null);
  const { Id } = useSelector((state) => state.User);
  const studentAxios = useStudentAxiosIntercepter();
  const location = useLocation();
  const [applied,setApplied] = useState(false);
  const [country,setCountry] = useState(null)
  const [application,setApplication] = useState({})
  useEffect(() => {
    // console.log(location.state);
    
    if (location.state?.course) {
      setCourse(location.state?.course);
      // console.log(location.state.course);   
      setCountry(location.state?.course.countryInfo||location.state?.course.country)
      const countryToSet = location.state?.course.countryInfo || location.state?.course.country;
      setCountry(countryToSet);

    }
  }, [location]);

  useEffect(()=>{
      studentAxios.get('/student_application',{
        params: {
          courseID : location.state.course._id,
          studentID : Id,
        }
      }).then((response)=>{
          console.log('Applied',response.data.applied);
          setApplied(response.data.applied)
          setApplication(response.data.applied[0])
        }).catch((error)=>{
        console.log(error.response.data);
      })
  },[location,Id])
  const handleApply = () => {
    // console.log(course._id);

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
        studentAxios
          .post('/apply_course', { id })
          .then((response) => {
            // console.log(response);
            showToast(response.data.message);
            // if(response.status===200){
            //   setApplied(true);
            // }
          });
      }
    });
  };

  const makePayment = async () => {
    const stripe = await loadStripe('pk_test_51OHixDSJYia4uvqdHG3CLqt8yNNQyd7bmI9AXQDyLiriRwdHoMmlvqrJSDDdO27yuApUoPqY6Yh94KrYEfL1cCNt00qNJxd2Nj');
    console.log(application);
    studentAxios.post('/create_check_out',{application:location.state,id:application._id })
    .then((response)=>{
      const result = stripe.redirectToCheckout({sessionId:response.data.id});
      console.log(result);
      if(result.error){
        console.log(result);
        navigate('/course_details/cancel',{state:{result}})
      }
      studentAxios.post('/checkout_success',{id:application._id ,sessionId:response.data.id,result})
      .catch((error)=>{
          console.log(error);
      })
      
    })
  }
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
      <div className="w-full max-w-screen-xl  mx-auto py-10  p-6 bg-white rounded-md shadow-md">
        {course ? (
          <div className="flex w-full justify-center md:flex-row">
            <div className='w-5/6 flex bg-white shadow-2xl rounded-lg justify-content-center'>
              <div className='flex mx-auto justify-center my-10'>
                {/* Left Section */}
                <div className="w-full md:w-3/5 pr-6">
                  <div className="text-center">
                    <h1 className="text-3xl capitalize font-semibold text-gray-800 mb-4">{course.header}</h1>
                    <div className='m-10' >
                    <img
                      className="rounded-lg shadow-lg mx-auto w-full object-cover object-center border-4 border-gray-300"
                      src={course.course_image ? course.course_image.url : defaultImage}
                      alt="Course Image"
                    />
                    </div>

                  </div>
                  {applied&&applied.paymentStatus!=='Pending'&&(
                    <div className='flex w-full justify-center mt-6 ' >
                      <div className='border flex justify-evenly items-center w-full border-sky-600 rounded-lg mx-5 py-2 px-1' >
                        <p className='my-3 capitalize'>{course.creator?.consultancy_name||'Consultant'} Has Requested Payment</p>
                        <div className=' my-3'>
                          <button onClick={makePayment} className='px-5 py-3 bg-emerald-500 text-white rounded-lg ' >Pay Now</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Section */}
                <div className='flex mx-auto justify-content-center w-2/5'>
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
                          <img className='object-cover object-center mx-3 w-5 h-5 rounded-full' src={ country?.image.url} alt="" />
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
            <h2 className="text-2xl underline capitalize text-gray-600">Students Qualification</h2>
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
            <h2 className="text-2xl underline capitalize text-gray-600">Requirements</h2>
            <p className="text-gray-800">{course?.requirements_header}</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="text-center">
            <h2 className="text-2xl underline capitalize text-gray-600">Requirements Description</h2>
            <p className="text-gray-800">{course?.requirements_blob}</p>
          </div>
        </div>


      </div>
      <ToastContainer />
    </div>

  );
};

export default CourseDetails;

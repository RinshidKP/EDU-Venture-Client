import {useState,useEffect} from 'react'
import { studentAPI } from '../../apiRoutes/studentAPI'
import defaultImage from '../../assets/download.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookReader, faPen } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import queryString from 'query-string';

const ConsultentProfile = () => {

  const [consultent,setConsultent]= useState()
  const { Token,Role } = useSelector((state) => state.User);
  const [imgUrl,setImgUrl] = useState('')
  const [courses,setCourses] = useState([])
  const navigate = useNavigate()

  const location = useLocation();
  useEffect(() => {
    if(location.state.consultent){
      setConsultent(location.state.consultent);
      setImgUrl(location.state.consultent.profile_image.url);
      
    }

    studentAPI.get(`/consultent_courses/?id=${location.state.consultent._id}`, {
      headers: {
        'Authorization': Token,
        'userRole': Role,
      }
    })
    .then((response) => {
      setCourses(response.data.courses);
      console.log(response.data);
    })
    .catch((error) => {
      console.error('Error fetching courses:', error);
    });
    
  }, [location]);
  

   
return (
<div>

  <div className='flex items-center mt-10'>
    <div className='w-1/2 flex justify-center'>

    <div className='h-auto w-2/4 flex items-center justify-center my-auto'>
      <img className='rounded-lg shadow-lg' src={imgUrl ? imgUrl: defaultImage} alt='User Profile' />
    </div>
    </div>
    <div className='h-full w-1/2  flex flex-col'>
      <div className='flex items-center justify-start'>
        <h3 className='text-4xl text-center mt-10 text-dark'>
          {consultent ? consultent?.consultancy_name : 'Consultancy Name'}
        </h3>
      </div>
      {consultent?.countries ? (
        <p className="text-xl text-dark mt-4">
          <span className="flex">
            Focused On: {consultent.countries.map((country) => country + ', ')}
          </span>
        </p>
      ) : (
        <p className="text-xl text-dark mt-4">
          <span className="flex">Focused On: Countries</span>
        </p>
      )}

      <div className=' '>
        <div className='max-w-md '>
          <p className=' text-sm lg:text-base xl:text-lg 2xl:text-xl text-center text-dark mt-5'>
            Description : {consultent ? consultent?.description : ' an Indian firm whose goal is to support students in their future'}
          </p>
        </div>
      </div>
      <div>
        <button onClick={()=>{navigate(`/student_chat?${queryString.stringify(consultent)}`)}} className='bg-white rounded-lg px-4 py-1 border-2 border-black'>
          Chat
        </button>
      </div>
    </div>
  </div>
  <div className=' flex items-center m-10 justify-center'>
    <h3 className="border text-2xl text-center border-green-800 w-3/4 py-3 bg-white-100">
      Our Courses
    </h3>
  </div>

  <div className="w-full flex flex-wrap justify-evenly ">
  {courses.map((course) => (
        <div
        key={course._id}
        className="m-5 transition-transform duration-500 ease-in-out hover:scale-110 sm:w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
    >
        <div className="flex justify-between">
            <div>
                <h5
                    className={`mb-2 capitalize  font-semibold tracking-wide text-lg ${!course.is_active ? "text-red-600" : "text-gray-900"
                        } font-bold tracking-tight dark:text-white`}
                >
                    {course.header}
                </h5>
            </div>
            <div className="flex ">
                <h2 className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    {course.countryInfo?.name}
                </h2>
                <img
                    className=" mx-1 rounded-full object-cover object-center h-5 w-5"
                    src={course.countryInfo?.image.url}
                    alt=""
                />
            </div>
        </div>
        <img
            className="object-cover object-center"
            src={course.course_image.url}
            alt=""
        />
        <p className="my-1 font-normal line-clamp-2 text-gray-700 dark:text-gray-400">
            {course.short_blob}
        </p>
        <div className="flex justify-between">
            <h2 className="my-1 font-normal text-gray-700 dark:text-gray-400">
                Provided By : {course.creator?.consultancy_name}
            </h2>
        </div>
        <div className="flex justify-evenly ">
            <a
                onClick={() => {
                    navigate(`/course_details`, { state: { course: course } });
                }}
                className="inline-flex group items-center px-3 py-2 text-sm font-medium text-center transition-width hover:w-full duration-500 ease-in-out text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
                <div className="flex items-center justify-between w-full">
                    <span>Read more</span>
                    <svg
                        className="w-3.5 h-3.5 ml-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                    </svg>
                    <FontAwesomeIcon
                        icon={faBookReader}
                        className="text-white opacity-0 group-hover:opacity-100"
                    />
                </div>
            </a>
        </div>
    </div>
      ))}
  </div>
</div>


)
}

export default ConsultentProfile
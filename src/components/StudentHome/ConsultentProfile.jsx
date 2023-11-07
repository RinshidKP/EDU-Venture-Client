import {useState,useEffect} from 'react'
import { studentAPI } from '../../apiRoutes/studentAPI'
import defaultImage from '../../assets/download.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { baseImageUrl } from '../../config/apiURL';
import queryString from 'query-string';

const ConsultentProfile = () => {

  const [consultent,setConsultent]= useState()
  const { Token,Role } = useSelector((state) => state.User);
  const [imgUrl,setImgUrl] = useState('')
  const [courses,setCourses] = useState([])
  const navigate = useNavigate()

  const location = useLocation();
  useEffect(() => {
    const queryParams = queryString.parse(location.search);
    console.log(queryParams);
    setConsultent(queryParams);
    setImgUrl(queryParams.profile_image);


    studentAPI.get(`/consultent_courses/?id=${queryParams._id}`, {
      headers: {
        'Authorization': Token,
        'userRole': Role,
      }
    })
    .then((response) => {
      setCourses(response.data.courses);
    })
    .catch((error) => {
      console.error('Error fetching courses:', error);
    });
    
  }, [location.search]);
  

   
return (
<div>

  <div className='flex items-center mt-10'>
    <div className='w-1/2 flex justify-center'>

    <div className='h-auto w-2/4 flex items-center justify-center my-auto'>
      <img className='rounded-lg shadow-lg' src={imgUrl ? baseImageUrl+imgUrl: defaultImage} alt='User Profile' />
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
      <div key={course._id} className="mx-2 my-5 h-1/2 w-1/4 max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 ">
        <a href="#">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {course.header}
          </h5>
        </a>
        <img src={baseImageUrl+course.course_image} alt="" />
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {course.short_blob}
        </p>
        <a onClick={()=>{
          navigate(`/course_details?${queryString.stringify(course)}`);
          }} href="#" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Read more
          <svg className="w-3.5 h-3.5 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
          </svg>
        </a>
      </div>
    ))}
  </div>
</div>


)
}

export default ConsultentProfile
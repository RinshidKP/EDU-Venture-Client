import { useEffect, useState } from 'react';
import { studentAPI } from '../../apiRoutes/studentAPI';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import queryString from 'query-string';
const HomeCourses = () => {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([]);
  const { Token, Role } = useSelector((state) => state.User);
  
  useEffect(() => {
    studentAPI.get('/list_courses',
    {headers: {
      'Authorization': Token,
      'userRole': Role,
    }},)
      .then((response) => {
        console.log('Courses',response);
        setCourses(response.data.courses);
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
      });
  }, [Token,Role]);

  return (
    <div className="w-full flex flex-wrap justify-evenly ">
    {courses.map((course) => (
      <div key={course._id} className="mx-2 group/items  my-5 h-1/2 w-1/4 max-w-sm p-4 transition-transform hover:scale-110 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 ">
        <a href="#">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {course.header}
          </h5>
        </a>
        <img src={course.course_image.url} alt="" />
        <div className='h-12'>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 line-clamp-2  hover:line-clamp-5 text-ellipsis hover:text-clip ">
            {course.short_blob}
          </p>
        </div>
        <div className='m-1 '>
        <a onClick={()=>{
          navigate(`/course_details?${queryString.stringify(course)}`);
          }} 
          className="inline-flex items-center px-3 py-2
           text-sm font-medium text-center text-white
            bg-blue-700 rounded-lg hover:bg-blue-950
            hover:w-full hover:opacity-100 
            focus:ring-4 focus:outline-none focus:ring-blue-300 
            dark:bg-blue-600 dark:hover:bg-blue-700
             dark:focus:ring-blue-800
             group-hover/items:opacity-50
             ">
          Read more
          <svg className="w-3.5 h-3.5 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
          </svg>
        </a>
        </div>
      </div>
    ))}
  </div>
  );
};

export default HomeCourses;

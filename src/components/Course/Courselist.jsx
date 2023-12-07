import { useEffect, useState } from 'react';
import { consultentApi } from '../../apiRoutes/studentAPI';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import queryString from 'query-string';

const CourseList = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);


  const { Token, Role } = useSelector((state) => state.User);

  useEffect(() => {
    consultentApi
      .get('/consultent_courses', {
        headers: {
          'Authorization': Token,
          'userRole': Role,
        },
      })
      .then((response) => {
        setCourses(response.data.courses);
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
      });
  }, [courses, Role, Token]);




  return (
    <div className="w-full flex flex-wrap justify-center mb-10">
      
      {courses.map((course) => (
        <div key={course._id} className=" my-5 w-full max-w-sm px-5 py-5 mx-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 ">
          <a>
            <h5 className={`mb-2 text-2xl ${!course.is_active ? 'text-red-600' : 'text-gray-900'} font-bold tracking-tight dark:text-white`}>
              {course.header}
            </h5>
          </a>
          <img src={course.course_image.url} alt="" />
          <p className=" font-normal text-gray-700 line-clamp-2 dark:text-gray-400">
            {course.short_blob}
          </p>
          <p className="mb-3 font-semibold text-gray-700 dark:text-gray-400">
            {course.country?.name}
          </p>
          <div className='flex justify-evenly ' >
            <a
              onClick={() => {
                navigate(`/profile/create_details?${queryString.stringify(course)}`);
              }}
              className="inline-flex cursor-pointer line-clamp-3 items-center px-3 py-2 text-sm font-medium text-center text-white bg-cyan-600 rounded-lg hover:bg-cyan-800 focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
            >
              Read more
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
            </a>
            <a
              onClick={() => {
                navigate(`/profile/edit_details?${queryString.stringify(course)}`);
              }}
              className="inline-flex cursor-pointer items-center px-3 py-2 text-sm font-medium text-center text-white bg-cyan-700 rounded-lg hover:bg-cyan-800 focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
            >
              Edit Course
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
            </a>
          </div>

        </div>
      ))}
    </div>
  );
};

export default CourseList;
import { useEffect, useState } from 'react';
import { studentAPI } from '../../apiRoutes/studentAPI';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookReader } from '@fortawesome/free-solid-svg-icons';
import { useStudentAxiosIntercepter } from '../../customHooks/useStudentAxiosIntercepter';
const HomeCourses = () => {
    const navigate = useNavigate()
    const [courses, setCourses] = useState([]);
    const studentAxios = useStudentAxiosIntercepter();

    useEffect(() => {
        studentAxios.get('/list_courses')
            .then((response) => {
                console.log('Courses', response);
                setCourses(response.data.courses);
            })
            .catch((error) => {
                console.error('Error fetching courses:', error);
            });
    }, []);

    return (
        <div className="w-full flex flex-wrap justify-center mb-10 ">
            {courses ? courses.map((course) => (
                <div
                    key={course._id}
                    className="m-5 transition-transform duration-500 ease-in-out hover:scale-110 sm:w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                >
                    <div className="flex justify-between ">
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
                            className="inline-flex group  items-center px-3 py-2 text-sm font-medium text-center transition-width hover:w-full duration-500 ease-in-out text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
            )) : (
                <div>
                    No courses Available
                </div>
            )}
        </div>
    );
};

export default HomeCourses;
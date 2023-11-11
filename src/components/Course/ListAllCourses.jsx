import { useEffect, useState } from "react";
import { studentAPI } from "../../apiRoutes/studentAPI";
import { useNavigate } from "react-router-dom";
import { baseImageUrl } from "../../config/apiURL";
import queryString from "query-string";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookReader } from "@fortawesome/free-solid-svg-icons";

const ListAllCourses = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [courses, setCourses] = useState([]);
    const [totalCoursesCount, setTotalCoursesCount] = useState(0);
    const coursesPerPage = 9;

    useEffect(() => {
        studentAPI
            .get('/view_courses', {

                params: {
                    page: currentPage,
                    limit: coursesPerPage,
                },
            })
            .then((response) => {
                console.log(response.data.courses);
                setCourses(response.data.courses);
                setTotalCoursesCount(response.data.totalCoursesCount);
            })
            .catch((error) => {
                console.error('Error fetching courses:', error);
            });
    }, [currentPage]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };
    
    const handlePrevClick = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    
    const handleNextClick = () => {
        if (currentPage < Math.ceil(totalCoursesCount / coursesPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };
    

    return (
        <div>
            <div className="w-full flex flex-wrap justify-center mb-10">
                {courses.map((course) => (
                    <div key={course._id} className="m-5 transition-transform duration-500 ease-in-out hover:scale-110 sm:w-1/2 md:w-1/3 lg:w-1/4 p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 ">
                        <div className="flex justify-between">
                                <div>
                                    <h5 className={`mb-2 capitalize  font-semibold tracking-wide text-lg ${!course.is_active ? 'text-red-600' : 'text-gray-900'} font-bold tracking-tight dark:text-white`}>
                                        {course.header}
                                    </h5>
                                    
                                </div>
                                <div className="flex ">
                                    <h2 className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                        {course.countryInfo?.name}
                                    </h2>
                                    <img className=" mx-1 rounded-full object-cover object-center h-5 w-5" src={baseImageUrl+course.countryInfo?.image} alt="" />
                                </div>
                            </div>
                        <img className="object-cover object-center" src={baseImageUrl + course.course_image} alt="" />
                        <p className="my-1 font-normal text-gray-700 dark:text-gray-400">
                            {course.short_blob}
                        </p>
                        <div className="flex justify-between">
                        <h2 className="my-1 font-normal text-gray-700 dark:text-gray-400">
                            Provided By : {course.creator.consultancy_name}
                        </h2>
                        </div>
                        <div className='flex justify-evenly '>
                        <a
  onClick={() => {
    navigate(`/course_details`,{state:{course:course}});
    // navigate(`/course_details?${queryString.stringify(course)}`);
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

            {/* Pagination controls */}
            <div className="flex justify-center my-15">
                <ul className="flex list-none">
                    {Array.from(
                        { length: Math.ceil(totalCoursesCount / coursesPerPage) },
                        (_, i) => (
                            <li key={i}>
                                <button
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`px-4 py-2 ml-2 border ${currentPage === i + 1 ? 'bg-blue-700 text-white' : 'bg-white text-blue-700'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            </li>
                        )
                    )}
                </ul>
                <button
                    onClick={handlePrevClick}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 ml-2 border ${currentPage === 1 ? 'bg-gray-400 text-white' : 'bg-blue-700 text-white'
                        }`}
                >
                    Previous
                </button>
                <button
                    onClick={handleNextClick}
                    disabled={currentPage >= Math.ceil(totalCoursesCount / coursesPerPage)}
                    className={`px-4 py-2 ml-2 border ${currentPage >= Math.ceil(totalCoursesCount / coursesPerPage)
                        ? 'bg-gray-400 text-white'
                        : 'bg-blue-700 text-white'
                        }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default ListAllCourses;

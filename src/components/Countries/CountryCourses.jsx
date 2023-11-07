import React, { useEffect, useState } from 'react';
import { baseImageUrl } from '../../config/apiURL';
import { useNavigate } from 'react-router-dom';
import { studentAPI } from '../../apiRoutes/studentAPI';
import queryString from 'query-string';

const CountryCourses = ({ countryID, onClose }) => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        // Fetch courses data when the countryID prop changes
        studentAPI
            .get('/list_country_courses', {
                params: {
                    countryID: countryID,
                },
            })
            .then((response) => {
                setCourses(response.data.courses);
            })
            .catch((error) => {
                console.log(error.message);
            });
    }, [countryID]);

    const handleClose = () => {
        onClose();
    };

    return (
        <div className='p-6 shadow-lg md:w-auto md:m-5 bg-gray rounded-lg border border-gray-400  items-center'>
            <nav onClick={handleClose} className='flex justify-end cursor-pointer'>X</nav>
            {courses?(<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {courses.map((course) => (
                    <div key={course._id} className="bg-white rounded-lg shadow p-4">
                        <a href="#" className="text-xl font-bold text-gray-900 mb-2">{course.header}</a>
                        <img src={baseImageUrl + course.course_image} alt="" className="w-full h-auto mb-2" />
                        <p className="text-gray-700">{course.short_blob}</p>
                        <a
                            onClick={() => {
                                navigate(`/course_details?${queryString.stringify(course)}`);
                            }}
                            href="#"
                            className="block mt-4 bg-blue-700 text-white py-2 px-4 rounded-full text-center text-sm hover:bg-blue-800 transition-colors focus:ring focus:ring-blue-300 focus:outline-none"
                        >
                            Read more
                        </a>
                    </div>
                ))}
            </div>):(
                <div className='flex justify-center text-red-400'>
                    <h2>No Courses</h2>
                </div>
            )}
        </div>
    );
};

export default CountryCourses;

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStudentAxiosIntercepter } from '../../customHooks/useStudentAxiosIntercepter';

const CountryCourses = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const location = useLocation();
    const [country, setCountry] = useState(location.state.country);
    const studentAxios = useStudentAxiosIntercepter();
    useEffect(() => {
        studentAxios
            .get('/list_country_courses', {
                params: {
                    countryID: location.state.country._id,
                },
            })
            .then((response) => {
                setCourses(response.data.courses);
            })
            .catch((error) => {
                console.log(error.message);
            });
    }, []);

    return (
        <div className="container mx-auto p-6">
            <div className=' flex justify-normal w-full h-full m-5 bg-white'>
                <div className='w-1/3 flex justify-center'>
                    <img className='h-52 w-52 rounded-full' src={country.image.url} alt="" />
                </div>
                <div className='w-2/3 my-auto ps-5 ' >
                    <h2 className='text-3xl ' >{country.name}</h2>
                    <p
                    className='text-ellipsis '>
                        {country.description}
                    </p>
                </div>
            </div>
            <div className='mx-5 my-10 ' >
            {courses.length >0 ? (
                <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                    {courses.map((course) => (
                        <div key={course._id} className="bg-white rounded-lg shadow p-4">
                            <a href="#" className="text-xl font-bold text-gray-900 mb-2">
                                {course.header}
                            </a>
                            <img src={course.course_image.url} alt="" className="w-full h-auto mb-2" />
                            <p className="text-gray-700 line-clamp-4">{course.short_blob}</p>
                            <button
                                onClick={() => {
                                    navigate(`/course_details`,{state:{course}});
                                }}
                                className="block mt-4 bg-blue-700 text-white py-2 px-4 rounded-full text-center text-sm hover:bg-blue-800 transition-colors focus:ring focus:ring-blue-300 focus:outline-none"
                            >
                                Read more
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex justify-center items-center h-3/4">
                    <div className='' >
                    <h2 className='text-5xl font-bold text-gray-500  my-10' >No Courses Available</h2>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
};

export default CountryCourses;

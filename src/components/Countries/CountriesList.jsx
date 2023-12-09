import React, { useEffect, useState } from 'react';
import { studentAPI } from '../../apiRoutes/studentAPI';
import { useNavigate } from 'react-router-dom';
import { useStudentAxiosIntercepter } from '../../customHooks/useStudentAxiosIntercepter';

const CountriesList = () => {
    const [countries, setCountries] = useState([]);
    const studentAxios = useStudentAxiosIntercepter();
    const navigate = useNavigate();
    useEffect(() => {
        studentAxios.get('/home_countries')
            .then((response) => {
                setCountries(response.data.countries);
            })
    }, []);



    return (
        <div className='w-full font-sans flex flex-wrap justify-evenly sm:justify-center sm:items-center items-center   rounded-lg mx-auto  my-auto px-auto py-5'>
            {countries.map((country, index) => (
                <div
                    key={index}
                    className=' sm:w-5/6 md:w-1/3 lg:w-1/4 xl:w-1/5 sm:mx-24 md:mx-auto lg:mx-auto'
                >
                    <div className='h-full w-full group/items transition-transform hover:scale-105 py-5'>
                        <div className='flex flex-col justify-center items-center w-4/5'>
                            <img className="rounded-full relative h-48 w-48 md:h-2/3 lg:h-2/3 overflow-hidden bg-transparent  md:mx-12" src={country.image.url || 'Image'} alt="" />
                            <div className="block rounded-lg h-2/3  bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
                                <div className=" px-5 py-3">
                                    <h5 className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
                                        Country name: {country.name}
                                    </h5>
                                    <p className="mb-4 line-clamp-5 text-base text-neutral-600 dark:text-neutral-200">
                                        Description: {country.description}
                                    </p>
                                    <div className='flex justify-center' >
                                        <button
                                            onClick={() => navigate('/view_courses_by_country', { state: { country } })}
                                            className="inline-block rounded bg-white text-sky-950 px-6 pb-2 
                                        pt-2.5 text-xs font-medium uppercase leading-normal shadow-[0_4px_9px_-4px_#3b71ca] 
                                        transition duration-150 ease-in-out hover:bg-primary-600 
                                        hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] 
                                        group-hover/items:w-full group-hover/items:bg-sky-50
                                        focus:bg-primary-600 
                                        focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] 
                                        focus:outline-none focus:ring-0 active:bg-primary-700 
                                        active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] 
                                        dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] 
                                        dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] 
                                        dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] 
                                        dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                                            data-te-ripple-init
                                            data-te-ripple-color="light"
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            ))}

        </div>

    );
};

export default CountriesList;



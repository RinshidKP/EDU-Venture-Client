import React, { useEffect, useState } from 'react';
import { studentAPI } from '../../apiRoutes/studentAPI';
import CountryCourses from './CountryCourses';

const  CountriesList = () => {
    const [countries, setCountries] = useState([]);
    const [isOpen, setIsOpen] = useState(Array(0).fill(false));

    useEffect(() => {
        studentAPI.get('/home_countries')
            .then((response) => {
                console.log(response.data);
                setCountries(response.data.countries);
                setIsOpen(Array(response.data.countries.length).fill(false));
            })
    }, []);

    const handleViewCountry = (index) => {
        const newIsOpen = [...isOpen];
        newIsOpen[index] = true;
        setIsOpen(newIsOpen);
    };

    const handleCloseCountry = (index) => {
        const newIsOpen = [...isOpen];
        newIsOpen[index] = false;
        setIsOpen(newIsOpen);
    };

    return (
        <div className='w-full font-sans flex flex-wrap justify-around bg-white rounded-lg m-5 py-10'>
    {countries.map((country, index) => (
        <div
            key={index}
            className='w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5'
        >
            {isOpen[index] ? (
                <CountryCourses key={index} onClose={() => handleCloseCountry(index)} countryID={country._id} />
            ) : (
                <div className='h-full p-3 group/items transition-transform hover:scale-105'>
                    <div className='flex flex-col'>
                        <img className="rounded-full relative h-2/3 overflow-hidden bg-transparent mx-12" src={country.image.url || 'Image'} alt="" />
                        <div className="block rounded-lg h-2/3 bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
                            <div className="p-6">
                                <h5 className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
                                    Country name: {country.name}
                                </h5>
                                <p className="mb-4 line-clamp-5 text-base text-neutral-600 dark:text-neutral-200">
                                    Description: {country.description}
                                </p>
                                <div className='flex justify-center' >
                                    <button
                                        onClick={() => handleViewCountry(index)}
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
            )}
        </div>
    ))}
</div>

    );
};

export default CountriesList;


{/* <div
                key={index}
                className='p-6 mt-10 w-full md:m-5 bg-white rounded-lg shadow-lg flex flex-col md:flex-row items-center justify-center mx-auto'
                >
                    <div className="mr-4 bg-gray-400 max-w-20 h-20 w-20 rounded-full overflow-hidden">
                        <img
                            className="h-full w-full object-cover"
                            src={country.image.url || 'Image'}
                            alt='image'
                        />
                    </div>
                    <div className='flex-1 text-center md:text-left'>
                        <h1 className='mb-2 text-3xl font-bold text-gray-900'>
                            Country name: {country.name}
                        </h1>
                        <p className='text-center md:text-left'>
                            Description : {country.description}
                        </p>
                    </div>
                    <div className='mt-4 md:mt-0'>
                        
                            <button
                                onClick={() => handleViewCountry(index)}
                                className='bg-green-500 text-white py-2 px-4 rounded-full transform hover:scale-110 transition-transform duration-300'
                            >
                                View
                            </button>
                    </div>
                    </div> */}

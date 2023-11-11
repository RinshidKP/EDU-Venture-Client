import React, { useEffect, useState } from 'react';
import { baseImageUrl } from '../../config/apiURL';
import { studentAPI } from '../../apiRoutes/studentAPI';
import CountryCourses from './CountryCourses';

const StudentCountries = () => {
    const [countries, setCountries] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [countriesPerPage, setCountriesPerPage] = useState(9);
    const [totalCountries, setTotalCountries] = useState(0);
    const [isOpen, setIsOpen] = useState(Array(9).fill(false)); // Initialize isOpen array

    const handleViewCountry = (index) => {
        // Set the state of the clicked country to true to open its details
        const newIsOpen = [...isOpen];
        newIsOpen[index] = true;
        setIsOpen(newIsOpen);
    };

    const handleCloseCountry = (index) => {
        // Set the state of the clicked country to false to close its details
        const newIsOpen = [...isOpen];
        newIsOpen[index] = false;
        setIsOpen(newIsOpen);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handlePrevClick = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    useEffect(() => {
        studentAPI
            .get('list_all_countries', {
                params: {
                    page: currentPage,
                    limit: countriesPerPage,
                },
            })
            .then((response) => {
                setCountries(response.data.countries);
                setTotalCountries(response.data.totalCount);
            })
            .catch((error) => {
                console.error('Error fetching countries:', error);
            });
    }, [currentPage, countriesPerPage]);

    const handleNextClick = () => {
        if (currentPage < Math.ceil(totalCountries / countriesPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div className=' w-full font-sans '>
            {countries.map((country, index) => (
                <div
                key={index}
                className=' md:w-auto md:m-5  flex flex-col md:flex-row items-center'
                >
                {isOpen[index] ? ( 
                <CountryCourses key={index} onClose={()=>handleCloseCountry(index)} countryID={country._id} />
            ) : (                 <div
                key={index}
                className='p-6 mt-10 w-full md:m-5 bg-white rounded-lg shadow-lg flex flex-col md:flex-row items-center justify-center mx-auto'
                >
                    <div className="mr-4 bg-gray-400 max-w-20 h-20 w-20 rounded-full overflow-hidden">
                        <img
                            className="h-full w-full object-cover"
                            src={baseImageUrl + country.image || 'Image'}
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
                    </div>
                )}
                </div>
                ))}

            {/* Pagination controls */}
            <div className='flex justify-center '>
                <div className='mb-10 flex justify-center bg-pink-50 '>
                <ul className='flex list-none'>
                    {Array.from(
                        { length: Math.ceil(totalCountries / countriesPerPage) },
                        (_, i) => (
                            <li key={i}>
                                <button
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`px-4 py-2 ml-2 border ${
                                        currentPage === i + 1
                                            ? 'bg-sky-950 text-white'
                                            : 'bg-white text-blue-700'
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
                    className={`px-4 py-2 ml-2 border ${
                        currentPage === 1 ? 'bg-gray-400 text-white' : 'bg-sky-950 text-white'
                    }`}
                >
                    Previous
                </button>
                <button
                    onClick={handleNextClick}
                    disabled={currentPage >= Math.ceil(totalCountries / countriesPerPage)}
                    className={`px-4 py-2 ml-2 border ${
                        currentPage >= Math.ceil(totalCountries / countriesPerPage)
                            ? 'bg-gray-400 text-white'
                            : 'bg-sky-950 text-white'
                    }`}
                >
                    Next
                </button>
                </div>
            </div>
        </div>
    );
};

export default StudentCountries;

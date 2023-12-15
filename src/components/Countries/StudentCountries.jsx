import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudentAxiosIntercepter } from '../../customHooks/useStudentAxiosIntercepter';
import { ArrowDownAZ, ArrowUpAZ } from 'lucide-react';

const StudentCountries = () => {
    const [countries, setCountries] = useState([]);
    const studentAxios = useStudentAxiosIntercepter()
    const [search, setSearch] = useState('');
    const [spell, setSpell] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [countriesPerPage, setCountriesPerPage] = useState(5);
    const [totalCountries, setTotalCountries] = useState(0);
    const navigate = useNavigate();

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handlePrevClick = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    useEffect(() => {
        studentAxios
            .get('list_all_countries', {
                params: {
                    page: currentPage,
                    limit: countriesPerPage,
                    search: search,
                    spell: spell ? -1 : 1
                },
            })
            .then((response) => {
                console.log(response.data);
                setCountries(response.data.countries);
                setTotalCountries(response.data.totalCount);
            })
            .catch((error) => {
                console.error('Error fetching countries:', error);
            });
    }, [currentPage, countriesPerPage, search, spell]);

    const handleNextClick = () => {
        if (currentPage < Math.ceil(totalCountries / countriesPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div>
            <div className='w-full bg-transparent '>
                <div className="  flex justify-center w-full py-10">
                    <form className="w-4/6">
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg
                                    className="w-4 h-6 text-gray-500 dark:text-gray-400"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                    />
                                </svg>
                            </div>
                            <input
                                type="search"
                                onChange={(e) => setSearch(e.target.value)}
                                id="default-search"
                                className="block w-full px-4 py-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Enter Keyword to Search..."
                                required
                            />
                        </div>
                    </form>
                    <div onClick={() => setSpell(!spell)} className=' select-none border cursor-pointer bg-white px-5 mx-2 flex justify-evenly rounded items-center text-center py-1 border-black w-auto' >
                        {spell ? <ArrowDownAZ size={20} strokeWidth={1} />
                            : <ArrowUpAZ size={20} strokeWidth={1} />}
                    </div>
                </div>
            </div>
            <div className=' w-full font-sans '>
                {countries && countries.map((country, index) => (
                    <div
                        key={index}
                        className=' md:w-auto md:m-5  flex flex-col md:flex-row items-center'
                    >
                        <div
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
                                    onClick={() => navigate('/view_courses_by_country', { state: { country } })}
                                    className='bg-green-500 text-white py-2 px-4 rounded-full transform hover:scale-110 transition-transform duration-300'
                                >
                                    View
                                </button>
                            </div>
                        </div>
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
                                            className={`px-4 py-2 ml-2 border ${currentPage === i + 1
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
                            className={`px-4 py-2 ml-2 border ${currentPage === 1 ? 'bg-gray-400 text-white' : 'bg-sky-950 text-white'
                                }`}
                        >
                            Previous
                        </button>
                        <button
                            onClick={handleNextClick}
                            disabled={currentPage >= Math.ceil(totalCountries / countriesPerPage)}
                            className={`px-4 py-2 ml-2 border ${currentPage >= Math.ceil(totalCountries / countriesPerPage)
                                ? 'bg-gray-400 text-white'
                                : 'bg-sky-950 text-white'
                                }`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentCountries;

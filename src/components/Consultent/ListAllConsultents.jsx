import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import defaultImage from '../../assets/download.png'
import { useStudentAxiosIntercepter } from '../../customHooks/useStudentAxiosIntercepter';
import { ArrowDownAZ, ArrowUpAZ, SortAsc, Text } from 'lucide-react';
const ListAllConsultents = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [spell, setSpell] = useState(false);
    const studentAxios = useStudentAxiosIntercepter();
    const [consultenciesPerPage, setConsultenciesPerPage] = useState(9);
    const [consultencies, setConsultencies] = useState([]);
    const [totalConsultenciesCount, setTotalConsultenciesCount] = useState(0);

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
            .get('/view_consultencies', {

                params: {
                    page: currentPage,
                    limit: consultenciesPerPage,
                    search: search,
                    spell: spell ? -1 : 1
                },
            })
            .then((response) => {
                console.log(response);
                setConsultencies(response.data.consultants);
                setTotalConsultenciesCount(response.data.totalConsultantsCount);
            })
            .catch((error) => {
                console.error('Error fetching courses:', error);
            });
    }, [currentPage, consultenciesPerPage, search, spell]);

    const totalPages = Math.ceil(totalConsultenciesCount / consultenciesPerPage);

    const handleNextClick = () => {
        if (currentPage < Math.ceil(totalConsultenciesCount / consultenciesPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };
    return (
        <div>
            <div className='w-full bg-gray-200 '>
                <div className='text-6xl text-gray-400 text-center pt-10'>
                    <h2>Our Consultants</h2>
                </div>
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
            <div className="w-full flex flex-wrap justify-center md:p-8">
                {consultencies &&
                    consultencies.map((consultent) => (
                        <div
                            key={consultent._id}
                            className="w-full md:w-1/3 lg:w-1/4 xl:w-1/4 group/items my-3 md:mx-6 lg:mx-8 transition-transform hover:scale-105"
                        >
                            <div className="bg-sky-100 rounded-b-lg">
                                <img
                                    className="object-cover rounded-t-lg"
                                    src={consultent.profile_image.url || defaultImage}
                                    alt=""
                                />
                                <div className="p-5">
                                    <h5 className="my-1 text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                        {consultent.consultancy_name}
                                    </h5>
                                    <p className="my-2 text-sm line-clamp-2 sm:text-base font-normal text-gray-700 dark:text-gray-400">
                                        {consultent.description || 'Not Updated'}
                                    </p>
                                    <button
                                        onClick={() => {
                                            navigate(`/consultent_details`, { state: { consultent } });
                                        }}
                                        className="inline-flex items-center px-3 py-2 text-sm sm:text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 group-hover/items:bg-sky-700"
                                    >
                                        Read more
                                        <svg
                                            className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                                            aria-hidden="true"
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
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>


            {/* Pagination controls */}
            <div className="flex justify-center my-6 sm:my-8 md:my-10">
                <button
                    onClick={handlePrevClick}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 ml-2 border ${currentPage === 1 ? 'bg-gray-400 text-white' : 'bg-blue-700 text-white'
                        }`}
                >
                    Previous
                </button>
                <ul className="flex list-none">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <li key={i}>
                            <button
                                onClick={() => handlePageChange(i + 1)}
                                className={`px-4 py-2 ml-2 border ${currentPage === i + 1 ? 'bg-blue-700 text-white' : 'bg-white text-blue-700'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        </li>
                    ))}
                </ul>
                <button
                    onClick={handleNextClick}
                    disabled={currentPage >= totalPages}
                    className={`px-4 py-2 ml-2 border ${currentPage >= totalPages
                        ? 'bg-gray-400 text-white'
                        : 'bg-blue-700 text-white'
                        }`}
                >
                    Next
                </button>
            </div>
        </div>


    )
}

export default ListAllConsultents;
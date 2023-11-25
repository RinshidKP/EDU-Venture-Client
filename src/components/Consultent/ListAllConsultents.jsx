import { useEffect, useState } from 'react'
import { studentAPI } from '../../apiRoutes/studentAPI';
import queryString from 'query-string';
import { useNavigate } from 'react-router-dom';
import defaultImage from '../../assets/download.png'
const ListAllConsultents = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
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
        studentAPI
            .get('/view_consultencies', {

                params: {
                    page: currentPage,
                    limit: consultenciesPerPage,
                },
            })
            .then((response) => {
                console.log(response);
                setConsultencies(response.data.consultants);
                setTotalConsultenciesCount(response.data.totalConsultantsCount);
            })
            .catch((error) => {
                // setConsultenciesPerPage(0)
                console.error('Error fetching courses:', error);
            });
    }, [currentPage,consultenciesPerPage]);

    const totalPages = Math.ceil(totalConsultenciesCount / consultenciesPerPage);

    const handleNextClick = () => {
        if (currentPage < Math.ceil(totalConsultenciesCount / consultenciesPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };
    return (
        <div>
            <div className="w-full flex flex-wrap justify-center p-10">
                {consultencies.map((consultent) => (
                    <div key={consultent._id} className="max-w-sm group/items my-3 transition-transform hover:scale-105">
                        <div className='mx-2 bg-sky-100 rounded-b-lg'>
                            <img className='w-full h-40 object-cover rounded-t-lg' src={consultent.profile_image.url || defaultImage} alt="" />
                            <div className='p-5'>
                                <h5 className="my-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    {consultent.consultancy_name}
                                </h5>
                                <p className="my-2 font-normal text-gray-700 dark:text-gray-400">
                                    {consultent.description || 'Not Updated'}
                                </p>
                                <button
                                    onClick={() => {
                                        navigate(`/consultent_details`, { state: { consultent } })
                                    }}
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 group-hover/items:bg-sky-700"
                                >
                                    Read more
                                    <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" viewBox="0 0 14 10">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

                        {/* Pagination controls */}
            <div className="flex justify-center my-10">
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
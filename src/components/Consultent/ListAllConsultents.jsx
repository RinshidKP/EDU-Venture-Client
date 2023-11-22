import { useEffect, useState } from 'react'
import { studentAPI } from '../../apiRoutes/studentAPI';
import queryString from 'query-string';
import { useNavigate } from 'react-router-dom';

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
    const handleNextClick = () => {
        if (currentPage < Math.ceil(totalConsultenciesCount / consultenciesPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };
    return (
        <div>

            <div className="w-full flex flex-wrap justify-center mb-10">
                {consultencies.map((consultent) => (
                    <div key={consultent._id} className="mx-2 my-20 w-full max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 ">
                        <a >
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                {consultent.consultancy_name}
                            </h5>
                        </a>
                        <img src={consultent.profile_image.url} alt="" />
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                            {consultent.short_blob}
                        </p>
                        <a onClick={() => {
                            navigate(`/consultent_details?`,{state:{consultent:consultent}})
                        }} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Read more
                            <svg className="w-3.5 h-3.5 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                            </svg>
                        </a>
                    </div>
                ))}
            </div>

            {/* Pagination controls */}
            <div className="flex justify-center my-10">
                <ul className="flex list-none">
                    {Array.from(
                        { length: Math.ceil(totalConsultenciesCount / consultenciesPerPage) },
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
                    disabled={currentPage >= Math.ceil(totalConsultenciesCount / consultenciesPerPage)}
                    className={`px-4 py-2 ml-2 border ${currentPage >= Math.ceil(totalConsultenciesCount / consultenciesPerPage)
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

export default ListAllConsultents

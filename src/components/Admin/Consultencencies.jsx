import React, { useState, useEffect } from 'react'
import { ToastContainer, showErrorToast } from '../../helpers/toaster'
import defaultImage from '../../assets/dummy-profile.jpg'
import { useAdminAxiosInterceptor } from '../../customHooks/useAdminAxiosInterceptor'
const Consultencencies = () => {
    const [consultents, setConsultents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [consultenciesPerPage, setConsultenciesPerPage] = useState(9);
    const [totalConsultenciesCount, setTotalConsultenciesCount] = useState(0);
    const [search,setSearch] = useState('')

    const adminAxios = useAdminAxiosInterceptor();


    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handlePrevClick = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    useEffect(() => {
        adminAxios.get('/consultent_data', {
            params: {
                page: currentPage,
                limit: consultenciesPerPage,
                search: search,
            },
        })
            .then((response) => {
                setConsultents(response.data.consultents);
                setTotalConsultenciesCount(response.data.totalConsultantsCount);
            }).catch((error) => {
                console.log(error)
                showErrorToast(error.message)
            })
    }, [currentPage, consultenciesPerPage,search]);

    const handleNextClick = () => {
        if (currentPage < Math.ceil(totalConsultenciesCount / consultenciesPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };
    
    const handleDisableClick = (id,index) => {
        adminAxios.post('/consultant_access',{ id: id }).
        then((response)=>{
            const updatedConsultents = [...consultents];
            updatedConsultents[index] = response.data.consultant;
            setConsultents(updatedConsultents);
        }).catch((error)=>{
            console.log(error);
        })
    }

    const handleSearch = (e) => {
        console.log(e.target.value);
        if(e.target.value.length<320){
            setSearch(e.target.value)
        }
    }
    return (
        <div >
            <div className="flex flex-col m-5">
                <div className="-m-1.5 overflow-x-auto">
                    <div className="p-1.5 min-w-full inline-block align-middle">
                        <div className="border rounded-lg divide-y divide-gray-200 dark:border-gray-700 dark:divide-gray-700">
                            <div className="py-3 px-4">
                                <div className="relative max-w-xs">
                                    <label htmlFor="hs-table-search" className="sr-only">Search</label>
                                    <input
                                        type="text"
                                        name="hs-table-search"
                                        id="hs-table-search"
                                        className="py-2 px-3 ps-9 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                                        placeholder="Search for users"
                                        onChange={handleSearch}
                                    />
                                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
                                        <svg
                                            className="h-4 w-4 text-gray-400"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <circle cx="11" cy="11" r="8" />
                                            <path d="m21 21-4.3-4.3" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Profile Image</th>
                                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Name</th>
                                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Title</th>
                                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Email</th>
                                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">No of Courses</th>
                                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Is Active</th>
                                            <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {consultents.map((consultent,index) => (
                                            <tr className='' key={index}>
                                                <td className="py-3 ">
                                                    <div className="flex justify-center items-center h-5">
                                                        <img src={consultent?.profile_image ?(consultent?.profile_image.url) : defaultImage} className="border-gray-200 h-10 w-10 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" />
                                                        <label htmlFor="hs-table-search-checkbox-1" className="sr-only">Checkbox</label>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-white whitespace-nowrap text-sm font-medium dark:text-gray-200">{consultent?.consultancy_name}</td>
                                                <td className="px-6 py-4 text-white whitespace-nowrap text-sm font-medium dark:text-gray-200">{consultent?.title}</td>
                                                <td className="px-6 py-4 text-white whitespace-nowrap text-sm dark:text-gray-200">{consultent?.email}</td>
                                                <td className="px-6 py-4 text-white whitespace-nowrap text-sm dark:text-gray-200 text-center">{consultent?.coursesCount}
                                                    <span className='ml-2 text-gray-200 underline hover:text-gray-400 cursor-pointer'>view</span>
                                                </td>
                                                <td className="px-6 py-4 text-white whitespace-nowrap text-center text-sm font-medium">
                                                    <button onClick={() => handleDisableClick(consultent?._id,index)} type="button" className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-red-800 hover:text-red-300 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">{consultent?.isActive===true ?'Disable' :'Enable'}</button>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                                                    <button type="button" className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">Delete</button>
                                                </td>
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
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
                        <ToastContainer/>
        </div>
    )
}

export default Consultencencies

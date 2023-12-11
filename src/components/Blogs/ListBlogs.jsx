import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';
import { showErrorToast } from '../../helpers/toaster';
import { baseImageUrl } from '../../config/apiURL';
import { useStudentAxiosIntercepter } from '../../customHooks/useStudentAxiosIntercepter';

const ListBlogs = () => {


    const { Token, Role } = useSelector((state) => state.User)
    const [blogs, setBlogs] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [blogsPerPage, setBlogsPerPage] = useState(3);
    const [totalBlogsCount, setTotalBlogsCount] = useState(12);
    const [search, setSearch] = useState('')
    const studentAxios = useStudentAxiosIntercepter();

    useEffect(() => {
        studentAxios.get('/blogs_data', {
            params: {
                page: currentPage,
                limit: blogsPerPage,
                search: search,
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': Token,
                'userRole': Role,
            },
        }).then((response) => {
            console.log(response.data);
            if (response.status === 200) {
                setBlogs(response.data?.blogs)
                setTotalBlogsCount(response.data.totalBlogsCount)
            }
            showErrorToast(response.data.message)
        }).catch((error) => {
            showErrorToast(error.response.data.message)
        })
    }, [Role, Token, search, currentPage, blogsPerPage])

    const handleSearch = (e) => {
        console.log(e.target.value);
        if (e.target.value.length < 320) {
            setSearch(e.target.value)
        }
    }

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handlePrevClick = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextClick = () => {
        if (currentPage < Math.ceil(totalBlogsCount / blogsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    function formatDate(dateString) {
        const formattedDate = new Date(dateString).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
        });

        return formattedDate;
    }


    return (
        <div className="bg-gray-300 p-8">
            {/* Search Bar */}
            <div className="w-5/6 mx-auto mb-8">
                <input
                    onChange={handleSearch}
                    type="text"
                    placeholder="Search blogs..."
                    className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                />
            </div>
            {blogs && blogs.map((blog) => (
                <div key={blog.id} className="w-5/6 mx-auto bg-white rounded-lg shadow-md mb-8">
                    <div className='flex items-center'>
                        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold mt-5 ml-10">
                            {blog.heading}
                        </h3>
                    </div>
                    <div className=' flex justify-center'>
                        <div className='h-1/6 w-5/6 m-5'>
                            <img
                                src={baseImageUrl + blog.image}
                                alt="Blog Image"
                                className="my-1 rounded-lg max-w-full max-h-full"
                            />
                        </div>
                    </div>

                    <p className="text-gray-600 py-2 px-4">{blog.description}</p>
                    <div className='flex justify-between'>
                        <p className="text-sm text-gray-500 p-4">
                            Created on: {formatDate(blog.createdAt)}
                        </p>
                        <p className="text-gray-600 px-4 py-2"><span>Written By </span>{blog?.creator?.full_name}</p>
                    </div>

                </div>
            ))}


            {/* Pagination controls */}
            <div className="flex justify-center my-10">
                <ul className="flex list-none">
                    {Array.from(
                        { length: Math.ceil(totalBlogsCount / blogsPerPage) },
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
                    disabled={currentPage >= Math.ceil(totalBlogsCount / blogsPerPage)}
                    className={`px-4 py-2 ml-2 border ${currentPage >= Math.ceil(totalBlogsCount / blogsPerPage)
                        ? 'bg-gray-400 text-white'
                        : 'bg-blue-700 text-white'
                        }`}
                >
                    Next
                </button>
            </div>
            <ToastContainer />
        </div>
    );
};

export default ListBlogs;

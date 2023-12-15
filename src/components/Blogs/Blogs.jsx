import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { baseImageUrl } from '../../config/apiURL';
import { ToastContainer, showErrorToast } from '../../helpers/toaster';
import { useStudentAxiosIntercepter } from '../../customHooks/useStudentAxiosIntercepter';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const { Token, Role, Id } = useSelector((state) => state.User);
  const location = useLocation();
  const courses = location.state.courses;
  const studentAxios = useStudentAxiosIntercepter();

  const navigate = useNavigate()
  useEffect(() => {
    studentAxios.get('/user_blogs', {
      params: {
        id: Id
      },
      headers: {
        'Authorization': Token,
        'userRole': Role,
      },
    }).then((response) => {
      console.log(response.data);
      if (response.status === 200) {
        setBlogs(response.data.blogs)
      }
    })
  },[])

  const handleCreateClick = () => {
    courses ? () => navigate('/new_blog') : showErrorToast('You are not allowed')
    {console.log(courses);}
  }
  return (
    <div className="w-full flex flex-col justify-center items-center ">
      <div className='w-full h-auto flex justify-center py-10 bg-gray-200' >
        <h1 className='text-3xl' >Blogs</h1>
      </div>
      <div className="w-5/6 my-10 bg-white py-10 shadow-lg flex flex-wrap justify-evenly">

        {/* Number of Blogs */}
        <div className="w-full mb-4 text-center">
          {blogs ?
            <div>
              <p className="text-lg font-semibold">Total Blogs: {blogs.length}</p>
            </div>
            :
            <div>No Blogs Written</div>
          }
        </div>

        {/* Create Blog Button */}
        <button
          onClick={handleCreateClick}
          className="px-3 py-3 text-gray-300 bg-teal-800 hover:bg-teal-500 hover:text-white transition-transform hover:scale-110 rounded-lg m-5"
        >
          Create A Blog
        </button>

        {/* Display Blogs */}
        <div className="w-full flex flex-wrap justify-around">
          {blogs ?
            blogs.map((blog, index) => (
              <div key={index} className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 mb-4">
                <div className="bg-white group/item group-hover:shadow-2xl  p-4 rounded-md shadow-md transition-transform hover:scale-110 cursor-pointer">
                  <h3 className="text-lg font-semibold mb-2">{blog.heading}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{blog.description}</p>
                  <img
                    src={baseImageUrl + blog.image}
                    alt="Blog Image"
                    className="w-full h-32 object-cover mb-2 rounded-md"
                  />
                  <p className="text-sm text-gray-500">Created on: {blog.createdAt}</p>
                  <div className='flex justify-evenly'>

                    {blog.isActive ? (
                      <span className="text-green-500">Active</span>
                    ) : (
                      <span className="text-red-500">Inactive</span>
                    )}
                    <span onClick={()=>navigate('/edit_blog',{state:{blog}})} className='mx-3 invisible text-red-500 hover:underline group-hover/item:visible'>Edit</span>

                  </div>
                </div>
              </div>
            )):(
              <div>
                Write review
              </div>
            )}
        </div>
        <ToastContainer/>
      </div>
    </div>
  )
}

export default Blogs

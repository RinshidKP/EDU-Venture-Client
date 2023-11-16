import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { baseImageUrl } from '../../config/apiURL';
import { adminApi } from '../../apiRoutes/studentAPI';
import { ToastContainer } from 'react-toastify';
import defaultImage from '../../assets/dummy-profile.jpg'

const Students = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalStudentsCount, setTotalStudentsCount] = useState(0);
  const [search, setSearch] = useState('');

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
};

  const handlePrevClick = () => {
    if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
    }
};

const handleNextClick = () => {
    if (currentPage < Math.ceil(totalStudentsCount / itemsPerPage)) {
        setCurrentPage(currentPage + 1);
    }
};

  const { Token, Role } = useSelector((state) => state.User);

  useEffect(() => {
    adminApi
      .get('/students_data', {
        params: {
            page: currentPage,
            limit: itemsPerPage,
            search: search,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: Token,
          userRole: Role,
        },
      })
      .then((response) => {
        console.log(response);
        setStudents(response.data.students);
        setTotalStudentsCount(response.data.totalStudentsCount)
      })
      .catch((error) => {
        console.log(error);
      });
  }, [Role,Token,currentPage,search,itemsPerPage]);

  const changeAccess = (id) => {
    adminApi
      .get('/editaccess?id=' + id, {
        headers: {
          Authorization: Token,
        },
      })
      .then((res) => {
        setStudents(res.data.userData);
        console.log(res.data.userData);
      });
  };

  const handleDisableClick = (id, index) => {
    adminApi.post('/students_access',{ id: id },{
        headers: {
            'Content-Type': 'application/json',
            'Authorization': Token,
            'userRole': Role,
        },
    }).then((response)=>{
        const updatedStudents = [...students];
        updatedStudents[index] = response.data.student;
        setStudents(updatedStudents);
    }).catch((error)=>{
        console.log(error);
    })
  };

  const handleSearch = (e) => {
    console.log(e.target.value);
    if(e.target.value.length<320){
        setSearch(e.target.value)
    }}

  return (
    <div className="flex flex-col m-5">
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle">
          {/* Search Input */}
          <div className="py-3 px-4">
            <div className="relative max-w-xs">
              <label htmlFor="hs-table-search" className="sr-only">
                Search
              </label>
              <input
                type="text"
                name="hs-table-search"
                id="hs-table-search"
                className="py-2 px-3 ps-9 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                placeholder="Search for items"
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

          {/* Table */}
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                {/* Table Headers */}
                <tr>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Profile Image
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Student Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Student Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Verified
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {/* Table Rows */}
                {students.map((student, index) => (
                  <tr className="" key={index}>
                    <td className="py-3">
                      {/* Profile Image */}
                      <div className="flex justify-center items-center h-5">
                        <img
                          src={student?.profile_picture ? (baseImageUrl + student?.profile_picture) : defaultImage}
                          className="border-gray-200 h-10 w-10 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                        />
                        <label htmlFor="hs-table-search-checkbox-1" className="sr-only">
                          Checkbox
                        </label>
                      </div>
                    </td>
                    <td className="py-3">
                      {/* Profile Image */}
                      <div className="flex justify-center items-center h-5">
                        <h3>{student?.full_name}</h3>
                      </div>
                    </td>
                    <td className="py-3">
                        <div className="flex justify-center  h-5">
                            <h3 className='text-start'>{student?.email}</h3>
                        </div>
                    </td>
                    <td className="py-3">
                        <div className="flex justify-center items-center h-5">
                            <h3>{student?.isVerified?'Verifed':'Not Verified'}</h3>
                        </div>
                    </td>
                    {/* Other columns */}
                    <td className="px-6 py-4 whitespace-nowrap  text-center text-sm font-medium">
                      {/* Disable Button */}
                      <button
                        onClick={() => handleDisableClick(student?._id, index)}
                        type="button"
                        className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-red-800 hover:text-red-300 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                      >
                        {student?.isActive === true ? 'Disable' : 'Enable'}
                      </button>                      
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center my-10">
        <ul className="flex list-none">
          {/* Pagination buttons */}
          {Array.from({ length: Math.ceil(totalStudentsCount / itemsPerPage) }, (_, i) => (
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
        {/* Previous Page button */}
        <button
          onClick={() => handlePrevClick(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 ml-2 border ${currentPage === 1 ? 'bg-gray-400 text-white' : 'bg-blue-700 text-white'
            }`}
        >
          Previous
        </button>
        {/* Next Page button */}
        <button
          onClick={() => handleNextClick(currentPage + 1)}
          disabled={currentPage >= Math.ceil(totalStudentsCount / itemsPerPage)}
          className={`px-4 py-2 ml-2 border ${currentPage >= Math.ceil(totalStudentsCount / itemsPerPage)
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

export default Students;

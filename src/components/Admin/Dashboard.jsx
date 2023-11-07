import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { baseImageUrl } from '../../config/apiURL';
import { adminApi } from '../../apiRoutes/studentAPI';
import { FaEdit, FaTrashAlt, FaUnlock } from 'react-icons/fa';

const Dashboard = () => {
  const navigate = useNavigate();

  const [searchInput, setSearch] = useState('');
  const [dele, setDelete] = useState(1);
  const [students, setStudents] = useState([]);
  const [filterdata, setFilterData] = useState([]);

  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentItems = searchInput === ''
    ? students.slice(startIndex, endIndex)
    : filterdata.slice(startIndex, endIndex);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage);
  };

  const { Token, Role } = useSelector((state) => state.User);

  useEffect(() => {
    adminApi
      .get('/home', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: Token,
          userRole: Role,
        },
      })
      .then((res) => {
        console.log(res);
        setStudents(res.data.students);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [dele]);

  const deleteUser = (id) => {
    Swal.fire({
      title: 'User Deleted',
      text: 'The user has been successfully deleted.',
      icon: 'success',
    });
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        adminApi
          .delete('/user-delete?id=' + id, {
            headers: {
              Authorization: Token,
            },
          })
          .then((res) => {
            console.log(res);
            if (res.data) {
              setDelete(dele + 1);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  const filterUser = () => {
    const value = searchInput.toLowerCase().trim();
    setFilterData(
      students.filter((user) => {
        const nameMatch =
          user.username && user.username.toLowerCase().includes(value);
        const emailMatch =
          user.email && user.email.toLowerCase().includes(value);
        return nameMatch || emailMatch;
      })
    );
  };

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

  return (
    <div className="h-auto flex items-center justify-center">
      <div className="bg-opacity-50 my-10 bg-white text-black py-2 rounded-lg">
        <div className="max-w-screen-xl mx-auto px-2">
          <div className="mb-4">
            <div className="relative">
              <input
                onChange={(e) => (setSearch(e.target.value), filterUser())}
                placeholder="Username Or Name"
                className="border rounded p-2 pl-8 w-full bg-white text-black"
                type="text"
              />
              <i className="absolute left-3 top-3 text-gray-400 fas fa-search fa-lg"></i>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="table-fixed w-full bg-opacity-30 text-black">
              <thead>
                <tr>
                  <th className="border px-4 py-2 w-1/12">ID</th>
                  <th className="border px-4 py-2 w-1/12">USER IMG</th>
                  <th className="border px-4 py-2 w-3/12">EMAIL</th>
                  <th className="border px-4 py-2 w-2/12">USERNAME</th>
                  <th className="border px-4 py-2 w-2/12">STATUS</th>
                  <th className="border px-4 py-2 w-2/12">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((user, index) => (
                  <tr key={user._id}>
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">
                      <div className="flex items-center">
                        <img
                          src={user.image ? baseImageUrl + user.profile_picture : 'defaultImage'}
                          className="rounded-full h-8 w-8 object-cover mr-2"
                          alt=""
                          loading="lazy"
                        />
                      </div>
                    </td>
                    <td className="border px-4 py-2">
                      <div className="flex items-center">
                        <p>{user.email}</p>
                      </div>
                    </td>
                    <td className="border px-4 py-2">{user.username}</td>
                    <td
                      className={
                        'border px-4 py-2 ' +
                        (user.isActive ? 'text-green-900' : 'text-red-900')
                      }
                    >
                      {!user.isActive ? 'Blocked' : 'Active'}
                    </td>
                    <td className="border px-4 py-2 flex items-center">
                      <div className="flex">
                        <i
                          onClick={() => {
                            navigate('/dashboard/editprofile?id=' + user._id);
                          }}
                          className="cursor-pointer text-green-800 hover:text-green-900 mr-2 transition-colors duration-300 ease-in-out"
                        >
                          <FaEdit
                            onClick={() => {
                              navigate('/dashboard/editprofile?id=' + user._id);
                            }}
                            className="cursor-pointer text-green-800 hover:text-green-900 mr-2 transition-colors duration-300 ease-in-out"
                          />
                          Edit
                        </i>
                        <i
                          onClick={() => deleteUser(user._id)}
                          className="cursor-pointer text-red-600 hover:text-red-800 transition-colors duration-300 ease-in-out mr-2"
                        >
                          <FaTrashAlt
                            onClick={() => deleteUser(user._id)}
                            className="cursor-pointer text-red-600 hover:text-red-800 transition-colors duration-300 ease-in-out mr-2"
                          />
                          Del
                        </i>
                        <i
                          onClick={() => changeAccess(user._id)}
                          className="cursor-pointer text-blue-600 hover:text-blue-800 transition-colors duration-300 ease-in-out"
                        >
                          <FaUnlock
                            onClick={() => changeAccess(user._id)}
                            className="cursor-pointer text-blue-600 hover:text-blue-800 transition-colors duration-300 ease-in-out"
                          />
                          Access
                        </i>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="max-w-screen-xl mx-auto flex justify-between items-center px-2">
          <div className="mb-4">
            <label htmlFor="selectElement" className="block font-bold mb-2">
              Items per Page:
            </label>
            <select
              id="selectElement"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(e.target.value)}
              className="block w-32 p-2 border rounded shadow-md"
            >
              <option value="3">3</option>
              <option value="5">5</option>
              <option value="7">7</option>
              <option value="10">10</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-center mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-l ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Prev
          </button>
          <span className="py-2 px-4 bg-blue-200 text-blue-800 font-semibold">
            {currentPage}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={endIndex >= students.length}
            className={`bg-blue-500 hover-bg-blue-700 text-white font-semibold py-2 px-4 rounded-r ${
              endIndex >= students.length ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

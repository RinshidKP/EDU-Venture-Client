import React, { useEffect, useState } from 'react'
import AddCountryModal from './AddCountryModal';
import defaultImage from '../../assets/download.png'
import EditCountries from './EditCountries';
import { ToastContainer, showToast } from '../../helpers/toaster';
import { useAdminAxiosInterceptor } from '../../customHooks/useAdminAxiosInterceptor';
import { ArrowDownAZ, ArrowUpAZ } from 'lucide-react';
const Countries = () => {
  const [open, setOpen] = useState(false);
  const [countries, setCountries] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [countriesPerPage, setCountriesPerPage] = useState(5);
  const [totalCountries, setTotalCountries] = useState(0);
  const [search, setSearch] = useState('');
  const [spell, setSpell] = useState(false);
  const [filter,setFilter] = useState(0)

  const adminAxios = useAdminAxiosInterceptor();

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };
  const closeEditModal = (country) => {
    setEditOpen(false);
    console.log(country);
    console.log(countries[0], 'existing');
    setCountries(prevCountries =>
      prevCountries.map(prev =>
        prev._id === country._id ? country : prev
      )
    );
    setSelectedCountry(null);
  };

  const handleEditButton = (country) => {
    setEditOpen(true)
    setSelectedCountry(country._id)
  }

  useEffect(() => {
    adminAxios.get('/admin_country', {
      params: {
        page: currentPage,
        limit: countriesPerPage,
        search:search,
        spell: spell ? -1 : 1,
        filter:filter
      }
    })
      .then((response) => {
        console.log(response.data);
        setCountries(response.data.countries)
        setTotalCountries(response.data.totalCount);
      })
  }, [currentPage, countriesPerPage,search,spell,filter])

  const handleDisable = (country, index) => {

    const id = country._id;

    adminAxios
      .post('/disable_country', { id })
      .then((response) => {
        console.log(response.data);
        const updatedCountries = [...countries];
        updatedCountries[index] = { ...updatedCountries[index], isActive: response.data.isActive };

        setCountries(updatedCountries);
        showToast(response.data.message)
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const addNewCountries = (newCountry) => {
    setCountries((prevCountries) => [...prevCountries, newCountry]);
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
    if (currentPage < Math.ceil(totalCountries / countriesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleActiveFilterChange = (value)=>{
    switch (value) {
      case 'active':
        setFilter({isActive : true})
        break;
      case 'inactive':
        setFilter({isActive : false})
        break;
      case 'all':
        setFilter(0)
        break;
    
      default:
        setFilter(0)
        break;
    }
  }

  return (
    <div className='h-full'>
      <div className='flex w-full justify-around  ' >
        <form className=" w-3/6 md:w-4/6 my-5">
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
        <div onClick={() => setSpell(!spell)} className=' select-none border cursor-pointer bg-white px-3 my-5 mx-2 flex justify-evenly rounded items-center text-center  border-black w-auto' >
          {spell ? <ArrowDownAZ size={20} strokeWidth={1} />
            : <ArrowUpAZ size={20} strokeWidth={1} />}
        </div>
        <div className="text-black flex justify-evenly">
          <select
            className="bg-white px-1 py-1 my-5 rounded justify-end"
            onChange={(e) => handleActiveFilterChange(e.target.value)}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className=" text-white flex justify-evenly ">
          <button
            onClick={openModal}
            className="bg-teal-700 px-2 py-2 my-4 rounded justify-end"
          >
            Add Countries
          </button>
        </div>
      </div>
      <AddCountryModal open={open} setCountries={addNewCountries} onClose={closeModal} />
      <EditCountries open={editOpen} countryID={selectedCountry} onClose={closeEditModal} />

      {countries.map((country, index) => (
        <div key={index} className='p-6 my-3  md:w-auto md:m-5 bg-white rounded-lg border border-gray-400 flex flex-col md:flex-row items-center'>
          <div className="mr-4 bg-gray-400 max-w-20 h-20 w-20 rounded-full overflow-hidden">
            <img className="h-full w-full object-cover" src={country ? country.image.url : defaultImage} alt='image' />
          </div>
          <div className='flex-1 text-center md:text-left'>
            <h1 className='mb-2 text-3xl font-bold text-gray-900'>Country name: {country.name}</h1>
            <p className='text-center md:text-left'>Description : {country.description}</p>
          </div>
          <div className='mt-4 md:mt-0'>
            <button onClick={() => handleEditButton(country)} className='bg-blue-500 text-white py-2 px-4 rounded-full mb-2 md:mb-0 md:mr-2'>Edit</button>
            <button onClick={() => handleDisable(country, index)} className={` text-white py-2 px-4 rounded-full ${country.isActive === true ? 'bg-red-700' : 'bg-green-700'}`}>
              {country.isActive === true ? 'Disable' : 'Enable'}
            </button>

          </div>
        </div>
      ))}

      <ToastContainer />

      {/* Pagination controls */}
      <div className='flex justify-center py-5'>
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
  )
}

export default Countries

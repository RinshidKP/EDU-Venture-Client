import React, { useEffect, useState } from 'react'
import AddCountryModal from './AddCountryModal';
import defaultImage from '../../assets/download.png'
import { adminApi } from '../../apiRoutes/studentAPI';
import { useSelector } from 'react-redux';
import { baseImageUrl } from '../../config/apiURL';
import { useNavigate } from 'react-router-dom';
import EditCountries from './EditCountries';
import { ToastContainer, showToast } from '../../helpers/toaster';
const Countries = () => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const [countries, setCountries] = useState([]);
  const { Token, Role } = useSelector((state) => state.User);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };
  const closeEditModal = () => {
    setEditOpen(false);
    setSelectedCountry(null);
  };

  const handleEditButton = (country) => {
    setEditOpen(true)
    setSelectedCountry(country._id)
  }

  useEffect(() => {
    adminApi.get('/admin_country', {
      headers: {
        'Authorization': Token,
        'userRole': Role,
      }
    },).then((response) => {
      console.log(response.data);
      setCountries(response.data.countries)
    })
  }, [])

  const handleDisable = (country, index) => {

    const id = country._id;

    adminApi
      .post('/disable_country', { id }, {
        headers: {
          'Authorization': Token,
          'userRole': Role,
        }
      })
      .then((response) => {
        console.log(response.data);
        const updatedCountries = [...countries];
        updatedCountries[index] = { ...updatedCountries[index], isActive:response.data.isActive };

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

  return (
    <div className='h-full'>

      <AddCountryModal open={open} setCountries={addNewCountries} onClose={closeModal} />
      <EditCountries open={editOpen} countryID={selectedCountry} onClose={closeEditModal} />
      {countries.map((country, index) => (
        <div key={index} className='p-6   md:w-auto md:m-5 bg-white rounded-lg border border-gray-400 flex flex-col md:flex-row items-center'>
          <div className="mr-4 bg-gray-400 max-w-20 h-20 w-20 rounded-full overflow-hidden">
            <img className="h-full w-full object-cover" src={country.image ? baseImageUrl + country.image : defaultImage} alt='image' />
          </div>
          <div className='flex-1 text-center md:text-left'>
            <h1 className='mb-2 text-3xl font-bold text-gray-900'>Country name: {country.name}</h1>
            <p className='text-center md:text-left'>Description : {country.description}</p>
          </div>
          <div className='mt-4 md:mt-0'>
            <button onClick={() => handleEditButton(country)} className='bg-blue-500 text-white py-2 px-4 rounded-full mb-2 md:mb-0 md:mr-2'>Edit</button>
            <button onClick={() => handleDisable(country, index)} className='bg-red-700 text-white py-2 px-4 rounded-full'>
              {country.isActive === true ? 'Disable' : 'Enable'}
            </button>

          </div>
        </div>
      ))}
      <div className="sticky text-white flex justify-evenly top-0 shadow dark:bg-gray-800">
        <button
          onClick={openModal}
          className="bg-teal-700 px-3 py-2 m-3 rounded justify-end"
        >
          Add Countries
        </button>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Countries

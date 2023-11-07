import React, { useEffect, useState } from 'react'
import { studentAPI } from '../../apiRoutes/studentAPI';
import { baseImageUrl } from '../../config/apiURL';

const CountriesList = () => {
    const [open, setOpen] = useState(false);
    const [countries, setCountries] = useState([]);
    useEffect(() => {
        studentAPI.get('/home_countries')
            .then((response) => {
                console.log(response.data);
                setCountries(response.data.countries)
            })
    }, [])
    return (
        <div>
            {countries.map((country, index) => (
                <div key={index} className='p-6 md:w-auto md:m-5 bg-white rounded-lg border border-gray-400 flex flex-col md:flex-row items-center'>
                    <div className="mr-4 bg-gray-400 max-w-20 h-20 w-20 rounded-full overflow-hidden">
                        <img className="h-full w-full object-cover" src={baseImageUrl + country.image || 'Image'} alt='image' />
                    </div>
                    <div className='flex-1 text-center md:text-left'>
                        <h1 className='mb-2 text-3xl font-bold text-gray-900'>Country name: {country.name}</h1>
                        <p className='text-center md:text-left'>Description : {country.description}</p>
                    </div>
                    <div className='mt-4 md:mt-0'>
                        <button className='bg-green-500 text-white py-2 px-4 rounded-full'>View</button>
                    </div>
                </div>))}
        </div>
    )
}

export default CountriesList

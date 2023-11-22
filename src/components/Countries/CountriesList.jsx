import React, { useEffect, useState } from 'react'
import { studentAPI } from '../../apiRoutes/studentAPI';
import CountryCourses from './CountryCourses';

const CountriesList = () => {
    const [countries, setCountries] = useState([]);
    const [isOpen, setIsOpen] = useState();
    const handleViewCountry = (index) => {
        // Set the state of the clicked country to true to open its details
        const newIsOpen = [...isOpen];
        newIsOpen[index] = true;
        setIsOpen(newIsOpen);
    };
    useEffect(() => {
        studentAPI.get('/home_countries')
            .then((response) => {
                console.log(response.data);
                setCountries(response.data.countries)
                setIsOpen(Array(response.data.countries.length).fill(false))
            })
    }, [])

    const handleCloseCountry = (index) => {
        // Set the state of the clicked country to false to close its details
        const newIsOpen = [...isOpen];
        newIsOpen[index] = false;
        setIsOpen(newIsOpen);
    };

    return (
        <div className=' w-full font-sans '>
            {countries.map((country, index) => (
                <div
                key={index}
                className=' md:w-auto md:m-5  flex flex-col md:flex-row items-center'
                >
                {isOpen[index] ? ( 
                <CountryCourses key={index} onClose={()=>handleCloseCountry(index)} countryID={country._id} />
                    ) : (          
                   <div
                key={index}
                className='p-6 mt-10 w-full md:m-5 bg-white rounded-lg shadow-lg flex flex-col md:flex-row items-center justify-center mx-auto'
                >
                    <div className="mr-4 bg-gray-400 max-w-20 h-20 w-20 rounded-full overflow-hidden">
                        <img
                            className="h-full w-full object-cover"
                            src={country.image.url || 'Image'}
                            alt='image'
                        />
                    </div>
                    <div className='flex-1 text-center md:text-left'>
                        <h1 className='mb-2 text-3xl font-bold text-gray-900'>
                            Country name: {country.name}
                        </h1>
                        <p className='text-center md:text-left'>
                            Description : {country.description}
                        </p>
                    </div>
                    <div className='mt-4 md:mt-0'>
                        
                            <button
                                onClick={() => handleViewCountry(index)}
                                className='bg-green-500 text-white py-2 px-4 rounded-full transform hover:scale-110 transition-transform duration-300'
                            >
                                View
                            </button>
                    </div>
                    </div>
                )}
                </div>
                ))}
                </div>
    )
}

export default CountriesList

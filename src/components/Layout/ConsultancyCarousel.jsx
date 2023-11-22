import React, { useEffect, useState } from 'react';
import { studentAPI } from '../../apiRoutes/studentAPI';

const ConsultancyCarousel = () => {
    const [activeItem, setActiveItem] = useState(0);
    const [countries, setCountries] = useState([]);
  
    const handlePrevClick = () => {
      setActiveItem((prevItem) => (prevItem === 0 ? 3 : prevItem - 1));
    };
  
    const handleNextClick = () => {
      setActiveItem((prevItem) => (prevItem === 3 ? 0 : prevItem + 1));
    };
  
    useEffect(() => {
      studentAPI.get('/list_all_countries', {
        params: {
          page: 1,
          limit: 4,
        },
      })
        .then((response) => {
          console.log(response.data);
          setCountries(response.data.countries);
        });
    }, []);
  
  
    return (
      <div id="consultancy-carousel" className="relative w-full" data-carousel="static">
        {/* Carousel wrapper */}
        <div className="relative h-56 overflow-hidden md:h-96">
          {countries.map((country, index) => (
            <div
              key={index}
              className={`duration-200 ease-linear absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 ${
                index === activeItem ? 'opacity-100' : 'opacity-0'
              }`}
              data-carousel-item={index === activeItem ? 'active' : ''}
            >
              {country.image ? (
                <img
                src={country.image.url}
                  alt={country.name}
                  className="w-full h-[80%] md:h-[70%] lg:h-[60%] xl:h-[50%] rounded-md object-cover mb-4"
                />
              ) : (
                <img
                  src={`https://source.unsplash.com/800x400/?${
                    index === 0
                      ? 'nature,water,sky'
                      : index === 1
                      ? 'city,architecture,building'
                      : index === 2
                      ? 'mountain,landscape'
                      : 'technology,computer'
                  }`}
                  alt="Placeholder"
                  className="w-full h-full"
                />
              )}
                <div className="text-white absolute top-0 left-0 p-4">
                    <h2 className="text-2xl font-bold">{country.name}</h2>
                    {/* Add more content as needed */}
                </div>
            </div>
            
          ))}
        </div>
      {/* Slider controls */}
      <button
        type="button"
        className="absolute top-0 left-0 z-0 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        data-carousel-prev
        onClick={handlePrevClick}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <svg className="w-4 h-4 text-white dark:text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
          </svg>
          <span className="sr-only">Previous</span>
        </span>
      </button>
      <button
        type="button"
        className="absolute top-0 right-0 z-0 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        data-carousel-next
        onClick={handleNextClick}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <svg className="w-4 h-4 text-white dark:text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
          </svg>
          <span className="sr-only">Next</span>
        </span>
      </button>
    </div>
  );
};

export default ConsultancyCarousel;

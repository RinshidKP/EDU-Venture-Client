import React from 'react'
import StudentCountries from '../../components/Countries/StudentCountries'
import Header from '../../components/Layout/Header'
import flags from '../../assets/flags.png'
const StudentCountriesPage = () => {

  return (
    <div className='bg-pink-50'>
      <Header/>
      <nav className='w-full flex justify-center items-center relative z-0 shadow'>
        <div className={`w-full h-1/6 `} >
        <div
            className="bg-cover bg-no-repeat z-0 opacity-80"
            style={{ backgroundImage: `url(${flags})`,height: '50vh'}}
          >
            <div className="absolute inset-0 flex justify-center items-center">
            <h1
              // style={{ textShadow: '4px 1px 2px rgba(0, 0, 0, 0.4)' }}
              className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-wide 
                        bg-gradient-to-r from-lime-500 via-teal-500 to-amber-500 bg-clip-text 
                        text-transparent drop-shadow-lg z-10 animate-fade-right animate-once"
            >
              Study In Your Desired Countries
            </h1>

            </div>
          </div>
          {/* <div className="absolute z-0 inset-0 bg-gradient-to-b from-transparent via-transparent to-pink-50"></div> */}
        </div>
      </nav>
      <StudentCountries/>
    </div>
  )
}

export default StudentCountriesPage

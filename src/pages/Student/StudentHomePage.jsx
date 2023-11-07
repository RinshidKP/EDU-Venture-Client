import React from 'react'
import Header from '../../components/Layout/Header'
import Footer from '../../components/Layout/Footer'
import HomeCourses from '../../components/Home/HomeCourses'
import Consultencies from '../../components/Home/Consultencies'
import CountriesList from '../../components/Countries/CountriesList'

const StudentHomePage = () => {
  return (
    <div className=""> 
    
      <Header />
   
      <div className="mb-4 border border-gray-300">
        <div className="p-24 bg-white text-start">
          <h1 className=" text-5xl  font-roboto">Study abroad - your adventure starts here</h1>
          <h1 className=" text-2xl  font-roboto">Popular study abroad Partners</h1>
        </div>

        <Consultencies />
      </div>

    <div className="mb-4  border border-gray-300"> 
      <HomeCourses />
    </div>
    
    <div className="mb-4  border border-gray-300"> 
      <CountriesList/>
    </div>

      <Footer />

  </div>
  )
}

export default StudentHomePage

import React from 'react'
import Header from '../../components/Layout/Header'
import Applications from '../../components/StudentHome/Applications'
import Footer from '../../components/Layout/Footer'

const StudentsApplications = () => {
  return (
    <div className='h-screen'>
      <Header/>
      <Applications/>
      <Footer/>
    </div>
  )
}

export default StudentsApplications

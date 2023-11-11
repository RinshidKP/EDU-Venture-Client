import React from 'react'
import Header from '../../components/Layout/Header'
import ListAllConsultents from '../../components/Consultent/ListAllConsultents'
import Footer from '../../components/Layout/Footer'
import ConsultancyCarousel from '../../components/Layout/ConsultancyCarousel'

const ListAllConsultenciesPage = () => {
  return (
    <div>
      <Header/>
      <ConsultancyCarousel/>
      <ListAllConsultents/>
      <Footer/>
    </div>
  )
}

export default ListAllConsultenciesPage
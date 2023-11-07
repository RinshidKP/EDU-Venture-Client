import React from 'react'
import Header from '../../components/Layout/Header'
import ListAllConsultents from '../../components/Consultent/ListAllConsultents'
import Footer from '../../components/Layout/Footer'

const ListAllConsultenciesPage = () => {
  return (
    <div>
      <Header/>
      <ListAllConsultents/>
      <Footer/>
    </div>
  )
}

export default ListAllConsultenciesPage
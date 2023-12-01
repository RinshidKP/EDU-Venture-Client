import React from 'react'
import Header from '../../components/Layout/Header'
import Cancelled from '../../components/Course/Cancelled'
import Footer from '../../components/Layout/Footer'

const PaymentCancel = () => {
  return (
    <div className='h-screen' >
      <Header/>
      <Cancelled/>
      <Footer/>
    </div>
  )
}

export default PaymentCancel

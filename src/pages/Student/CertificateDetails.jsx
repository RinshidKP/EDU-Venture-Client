import React from 'react'
import Header from '../../components/Layout/Header'
import EditCertificate from '../../components/StudentHome/EditCertificate'

const CertificateDetails = () => {
  return (
    <div className='h-screen overflow-hidden' >
      <Header/>
      <EditCertificate/>
    </div>
  )
}

export default CertificateDetails

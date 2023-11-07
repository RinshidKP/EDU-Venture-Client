import React from 'react'
import ConsultentNavbar from '../../components/Layout/ConsultentNavbar'
import ConsultentChat from '../../components/Chat/ConsultentChat'

const ConsultentChatPage = () => {
  return (
    <div className='h-screen'>
      <ConsultentNavbar/>
      <ConsultentChat/>
    </div>
  )
}

export default ConsultentChatPage

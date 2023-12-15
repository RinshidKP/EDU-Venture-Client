import React from 'react'
import StudentChat from '../../components/Chat/StudentChat'
import Header from '../../components/Layout/Header'
import Footer from '../../components/Layout/Footer'


const StudentChatPage = () => {
  return (
    <div className='h-screen bg-sky-950'>
      <Header />
      <StudentChat />
      <Footer />
    </div>
  )
}

export default StudentChatPage

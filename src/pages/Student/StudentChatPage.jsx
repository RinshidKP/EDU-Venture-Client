import React from 'react'
import StudentChat from '../../components/Chat/StudentChat'
import Header from '../../components/Layout/Header'

const StudentChatPage = () => {
  return (
    <div className='h-screen'>
        <Header/>
      <StudentChat/>
    </div>
  )
}

export default StudentChatPage

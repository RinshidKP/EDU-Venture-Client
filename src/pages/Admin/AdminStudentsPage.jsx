import React from 'react'
import AdminNavBar from '../../components/Layout/AdminNavBar'
import Students from '../../components/Admin/Students'

const AdminStudentsPage = () => {
  return (
    <div className='h-screen'>
      <AdminNavBar/>
      <Students/>
    </div>
  )
}

export default AdminStudentsPage

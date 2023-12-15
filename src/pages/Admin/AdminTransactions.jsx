import React from 'react'
import AdminNavBar from '../../components/Layout/AdminNavBar'
import Transactions from '../../components/Admin/Transactions'

const AdminTransactions = () => {
  return (
    <div className='h-screen'>
    <AdminNavBar/>
    <Transactions/>
  </div>
  )
}

export default AdminTransactions

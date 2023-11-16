import React from 'react'
import Header from '../../components/Layout/Header.jsx'
import EditBlogForm from '../../components/Blogs/EditBlogForm.jsx'
const EditBlogPage = () => {
  return (
    <div className='h-screen'>
      <Header/>
      <EditBlogForm/>
    </div>
  )
}

export default EditBlogPage

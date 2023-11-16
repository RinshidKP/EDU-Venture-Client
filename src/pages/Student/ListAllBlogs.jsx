import React from 'react'
import Header from '../../components/Layout/Header'
import Footer from '../../components/Layout/Footer'
import ListBlogs from '../../components/Blogs/ListBlogs'

const ListAllBlogs = () => {
  return (
    <div>
      <Header/>
      <ListBlogs/>
      <Footer/>
    </div>
  )
}

export default ListAllBlogs

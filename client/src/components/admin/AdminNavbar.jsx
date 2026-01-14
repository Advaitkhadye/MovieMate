import React from 'react'
import { Link } from 'react-router-dom'

const AdminNavbar = () => {
  return (
    <div className='flex items-center justify-between px-6 md:px-10 h-16 border-b border-gray-300/30'>
      <Link to="/">
        <h1 className='text-3xl font-bold tracking-tighter bg-gradient-to-r from-gray-200 to-primary-dull bg-clip-text text-transparent'>MovieMate</h1>
      </Link>
    </div>
  )
}

export default AdminNavbar

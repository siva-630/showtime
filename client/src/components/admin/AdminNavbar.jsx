import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'

const AdminNavbar = () => {
  return (
    <div className="flex items-center justify-between px-6 md:px-10 h-16 border-b border-gray-300/20">
      <Link to="/" className="flex items-center gap-3">
        <img src={assets.logo} alt="logo" className="w-32 h-auto" />
        <div className="bg-primary/20 text-primary border border-primary/50 text-xs font-bold px-2.5 py-1 rounded-md tracking-wider uppercase">
          Admin
        </div>
      </Link>
    </div>
  )
}

export default AdminNavbar

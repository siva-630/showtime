import React from 'react'
import { Link } from 'react-router-dom'
import { Presentation } from 'lucide-react'

const AdminNavbar = () => {
  return (
    <div className="flex items-center justify-between px-6 md:px-10 h-16 border-b border-gray-300/20">
      <Link to="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
        <Presentation className="w-10 h-10" />
        <span className="text-xl font-bold tracking-wide max-md:hidden text-white">Admin Panel</span>
      </Link>
    </div>
  )
}

export default AdminNavbar

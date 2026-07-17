import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {assets} from '../assets/assets'; 
import { MenuIcon, SearchIcon, TicketPlus, XIcon, Clapperboard, Bot } from 'lucide-react';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { useAppContext } from '../context/AppContext';
import AIChatbot from './AIChatbot';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const {user} =useUser()
    const {openSignIn}= useClerk()
    const navigate = useNavigate()
    const {favoriteMovies, shows} = useAppContext();
  return (

    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">
    <Link to='/' className='max-md:flex-1 flex items-center gap-2 group'>
      <div className="bg-primary p-2 rounded-lg group-hover:bg-primary-dull transition-colors">
        <Clapperboard className="w-6 h-6 text-white" />
      </div>
      <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
        ShowTime
      </span>
    </Link>
    <div
  className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg  z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-8 min-md:px-8 py-3 max-md:h-screen min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-300/20 overflow-hidden transition-[width] duration-300  ${isOpen ? 'max-md:w-full':'max-md:w-0'}`}>
      <XIcon className='md:hidden absolute top-6 right-6 w-8 h-6 cursor-pointer' onClick={()=>setIsOpen(!isOpen)} />
  <Link onClick={()=> {scrollTo(0,0);setIsOpen(false)}}  to='/'>Home</Link>
  <Link onClick={()=> {scrollTo(0,0);setIsOpen(false)}} to='/movies'>Movies</Link>
  <Link onClick={()=> {scrollTo(0,0);setIsOpen(false)}} to='/theaters'>Theaters</Link>
  <Link onClick={()=> {scrollTo(0,0);setIsOpen(false)}} to='/releases'>Releases</Link>
  {favoriteMovies?.length >0  && <Link onClick={()=> {scrollTo(0,0);setIsOpen(false)}} to='/favorite'>Favorites</Link>}

    </div >

    <div className='flex items-center gap-6'>
      <div className="relative hidden md:block">
        <div className={`flex items-center bg-gray-800/80 rounded-full transition-all duration-300 border ${showSearch || searchQuery ? 'w-64 px-4 py-1.5 border-primary/50' : 'w-10 h-10 justify-center border-transparent cursor-pointer hover:bg-gray-700'}`}
             onClick={() => !showSearch && setShowSearch(true)}>
          <SearchIcon className={`w-5 h-5 text-gray-300 ${showSearch || searchQuery ? 'mr-2' : ''}`} />
          {(showSearch || searchQuery.length > 0) && (
            <input 
              type="text" 
              placeholder="Search movies..." 
              autoFocus
              className="bg-transparent text-sm text-white w-full outline-none placeholder-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={() => setTimeout(() => setShowSearch(false), 200)}
            />
          )}
        </div>
        
        {/* Search Results Dropdown */}
        {searchQuery.trim().length > 0 && (
          <div className="absolute top-full mt-2 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-xl shadow-black overflow-hidden z-50 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600">
            {shows?.filter(movie => movie.title?.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
              shows.filter(movie => movie.title?.toLowerCase().includes(searchQuery.toLowerCase())).map(movie => (
                <div 
                  key={movie._id} 
                  className="flex items-center gap-3 p-2 hover:bg-gray-800 cursor-pointer transition"
                  onClick={() => {
                    navigate(`/movie/${movie._id}`);
                    setSearchQuery("");
                    setShowSearch(false);
                  }}
                >
                  <img src={movie.poster_path ? import.meta.env.VITE_TMDB_IMAGE_BASE_URL + movie.poster_path : ''} alt={movie.title} className="w-10 h-14 object-cover rounded" />
                  <div>
                    <p className="text-sm font-medium text-white truncate max-w-[180px]">{movie.title}</p>
                    <p className="text-xs text-gray-400">{new Date(movie.release_date).getFullYear()}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-gray-400">No movies found</div>
            )}
          </div>
        )}
      </div>

      <button onClick={() => setIsChatOpen(true)} className="p-2 bg-gray-800/80 hover:bg-gray-700 rounded-full transition-colors relative group">
        <Bot className="w-5 h-5 text-primary" />
        <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full animate-ping"></span>
      </button>

     {
      !user ?(
     <button  onClick={openSignIn} className='px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'>Login</button>
      ) :(
        <UserButton>
         <UserButton.MenuItems>
          <UserButton.Action label='my Bookings' labelIcon={<TicketPlus width={15}/>} onClick={()=>navigate('/my-bookings')}/>
         </UserButton.MenuItems>
        </UserButton>

      )
     }
     
    </div>
    <MenuIcon  className='max-md:ml-4 md:hidden w-8 h-8 cursor-pointer'  onClick={()=>setIsOpen(!isOpen)} />
    <AIChatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  )
}

export default Navbar
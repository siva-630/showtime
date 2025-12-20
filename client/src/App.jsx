import React from 'react'
import Navbar from './components/Navbar'
import { Routes,Route, useLocation } from 'react-router-dom'
import Movies from './pages/Movies'
import MovieDetails from './pages/MovieDetails'
import MyBokings from './pages/MyBokings'

import Favorite from './pages/Favorite'
import {Toaster} from 'react-hot-toast'
import Footer from './components/Footer'
import Home from './pages/Home'
import SetLoyout from './pages/SetLoyout'
import Layout from './pages/admin/Layout'
import Listshows from './pages/admin/Listshows'
import ListBookings from './pages/admin/ListBookings'
import Addshows from './pages/admin/Addshows'
import Dashboard from './pages/Admin/Dashboard'
import { useAppContext } from './context/AppContext'
import { SignIn } from '@clerk/clerk-react'
import Loading from './components/Loading'

     




const App = () => {
  const isAdmin =useLocation().pathname.startsWith('/admin')
  const { user } = useAppContext()


  return (

    <>
    <Toaster/>
      {!isAdmin && <Navbar/>}
    
    <Routes>

    <Route path='/'element={<Home/>} />
    <Route path='/movies' element={<Movies/>}/>
  <Route path='/movie/:id' element={<MovieDetails/>}/>
  <Route path='/movie/:id/:date' element={<SetLoyout/>}/>
   <Route path="/my-bookings" element={<MyBokings />} />
      <Route path="/loading/:nextUrl" element={<Loading/>} />

  <Route path='/favorite' element={<Favorite/>}/>
   <Route path='/admin/*' element={user ?  <Layout/>: (
    <div className='min-h-screen flex justify-center items-center'>
      <SignIn  fallbackRedirectUrl={'/admin'}/>
    </div>
   )}>
   <Route index element ={<Dashboard/>}/>
   <Route path ='add-shows' element={<Addshows/>} />
   <Route path='list-shows' element={<Listshows/>}/>
   <Route path='list-bookings' element ={<ListBookings/>}/>

   </Route>
    </Routes>
     {!isAdmin && <Footer/>}
    </>

  )
}

export default App
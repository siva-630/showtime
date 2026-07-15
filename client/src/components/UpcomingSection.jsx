import React, { useEffect, useState } from 'react'
import BlurCircle from './BlurCircle';
import { StarIcon } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { dummyShowsData } from '../assets/assets';

const UpcomingSection = () => {
    const { axios, image_base_url } = useAppContext();
    const [upcoming, setUpcoming] = useState([]);

    const fetchUpcoming = async () => {
        try {
            const { data } = await axios.get('/api/show/upcoming');
            if (data.success && data.movies && data.movies.length > 0) {
                setUpcoming(data.movies);
            } else {
                setUpcoming(dummyShowsData);
            }
        } catch (error) {
            console.error(error);
            setUpcoming(dummyShowsData);
        }
    };

    useEffect(() => {
        fetchUpcoming();
    }, []);

    if(!upcoming || upcoming.length === 0) return null;

    const getImageUrl = (path) => path?.startsWith('http') ? path : image_base_url + path;

  return (
     <div className='px-6 md:px-16 lg:px-44 overflow-hidden mt-10 pb-20'>
        <div className='relative flex items-center justify-between pt-10 pb-10 border-t border-gray-800'>
            <BlurCircle top='0' right='-80px '/>
            <p className='text-gray-300 font-medium text-lg'>Upcoming Movies</p>
        </div>
        <div className='flex flex-wrap max-sm:justify-center gap-8 mt-4'>
          {upcoming?.slice(0, 4).map((movie) => (
             <div key={movie.id} className='flex flex-col justify-between p-3 bg-gray-800/50 rounded-2xl hover:scale-105 hover:shadow-[0_10px_20px_rgba(52,93,83,0.3)] transition-all duration-300 w-66 cursor-pointer group'>
                 <img
                     src={getImageUrl(movie.backdrop_path)}
                     alt={movie.title}
                     className='rounded-lg h-52 w-full object-cover object-right-bottom'
                 />
                 <p className='font-semibold mt-2 truncate'>{movie.title}</p>
                 <p className='text-sm text-gray-400 mt-2'>
                     Releases: {new Date(movie.release_date).toLocaleDateString()}
                 </p>
                 <div className='flex items-center justify-between mt-4 pb-3'>
                     <p className='text-xs text-primary bg-primary/10 px-2 py-1 rounded'>Coming Soon</p>
                     <p className='flex items-center gap-1 text-sm text-gray-400 pr-1'>
                         <StarIcon className='w-4 h-4 text-primary fill-primary' />
                         {movie.vote_average?.toFixed(1)}
                     </p>
                 </div>
             </div>
          ))}
        </div>
     </div>
  )
}

export default UpcomingSection;

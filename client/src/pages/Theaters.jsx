import React from 'react';
import BlurCircle from '../components/BlurCircle';

const mockTheaters = [
  {
    id: 1,
    name: 'Main Theater',
    location: 'City Center, Downtown',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop',
    screens: 5,
    features: ['IMAX', 'Dolby Atmos', 'Recliner Seats']
  },
  {
    id: 2,
    name: 'Starlight Cinemas',
    location: 'Westside Mall, 2nd Floor',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=2070&auto=format&fit=crop',
    screens: 3,
    features: ['4K Projection', 'Food Court', 'Wheelchair Accessible']
  },
  {
    id: 3,
    name: 'Grand Galaxy Plex',
    location: 'North Avenue, Tech Park',
    image: 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?q=80&w=2079&auto=format&fit=crop',
    screens: 8,
    features: ['Laser Projection', 'VIP Lounge', 'Valet Parking']
  },
  {
    id: 4,
    name: 'Classic Screen House',
    location: 'Old Town Square',
    image: 'https://images.unsplash.com/photo-1517602302552-471fe67acf66?q=80&w=2015&auto=format&fit=crop',
    screens: 2,
    features: ['Vintage Decor', 'Cafe', 'Student Discounts']
  }
];

const Theaters = () => {
    return (
        <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]'>
            <BlurCircle top='150px' left='0px' />
            <BlurCircle bottom='50px' right='50px' />

            <h1 className='text-lg font-medium my-4'>Our Partner Theaters</h1>
            
            <div className='flex flex-wrap max-sm:justify-center gap-8'>
                {mockTheaters.map((theater) => (
                    <div key={theater.id} className='flex flex-col justify-between p-4 bg-gray-800 rounded-2xl hover:scale-105 hover:shadow-[0_10px_20px_rgba(52,93,83,0.3)] transition-all duration-300 w-80 shadow-lg shadow-black/40 cursor-pointer group'>
                        <img
                            src={theater.image}
                            alt={theater.name}
                            className='rounded-lg h-48 w-full object-cover'
                        />
                        <div className='mt-4'>
                            <p className='font-bold text-xl truncate text-white'>{theater.name}</p>
                            <p className='text-sm text-gray-400 mt-1'>{theater.location}</p>
                        </div>
                        
                        <div className='mt-3 flex gap-2 flex-wrap'>
                            {theater.features.map((feature, index) => (
                                <span key={index} className='text-xs text-primary bg-primary/10 px-2 py-1 rounded'>
                                    {feature}
                                </span>
                            ))}
                        </div>
                        
                        <div className='flex items-center justify-between mt-5 pt-4 border-t border-gray-700'>
                            <p className='text-sm text-gray-300'>{theater.screens} Screens</p>
                            <button className='px-4 py-2 text-xs bg-primary hover:bg-primary-dull text-black font-medium rounded-full cursor-pointer transition'>
                                View Shows
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Theaters;

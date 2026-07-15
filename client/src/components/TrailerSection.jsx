import React, { useState } from 'react';
import { dummyTrailers } from '../assets/assets';
import { Play } from 'lucide-react';


const TrailerSection = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const getEmbedUrl = (url) => url.replace('watch?v=', 'embed/') + '?rel=0';
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-200">Watch the Trailer</h2>
      <div className="rounded-lg overflow-hidden shadow-lg w-full max-w-4xl aspect-video">
        <iframe
          className="w-full h-full"
          src={getEmbedUrl(dummyTrailers[currentIdx].videoUrl)}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
      <div className='flex gap-4 mt-8 max-w-4xl mx-auto overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200'>
        {dummyTrailers.map((trailer, idx) => (
          <div
            key={idx}
            className={`relative cursor-pointer group min-w-[128px] transition-all duration-300 ${currentIdx === idx ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-black' : 'hover:ring-2 hover:ring-amber-500/50 hover:ring-offset-1 hover:ring-offset-black'} rounded-lg`}
            onClick={() => setCurrentIdx(idx)}
          >
            <img src={trailer.image} alt="" className='rounded-lg w-32 h-20 object-cover brightness-50 group-hover:brightness-90 transition-all duration-300'/>
            <div className="absolute inset-0 m-auto flex items-center justify-center w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full group-hover:bg-amber-500 transition-all duration-300 drop-shadow-xl scale-95 group-hover:scale-110">
              <Play className="text-gray-300 group-hover:text-white fill-current opacity-90 transition-all duration-300 ml-1" size={20} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrailerSection;
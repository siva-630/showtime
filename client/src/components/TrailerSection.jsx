import React, { useState } from 'react';
import { dummyTrailers } from '../assets/assets';
import { PlayCircle } from 'lucide-react';


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
            className={`relative cursor-pointer group min-w-[128px] ${currentIdx === idx ? 'ring-4 ring-blue-500' : ''}`}
            onClick={() => setCurrentIdx(idx)}
          >
            <img src={trailer.image} alt="" className='rounded-lg w-32 h-20 object-cover brightness-75'/>
            <PlayCircle strokeWidth={1.6} className="absolute inset-0 m-auto text-white opacity-80 group-hover:scale-110 transition-transform" size={40} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrailerSection;
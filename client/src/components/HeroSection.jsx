import React, { useState, useEffect } from 'react';
import { ArrowRight, Calendar1Icon, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { dummyShowsData } from '../assets/assets';

const HeroSection = () => {
  const navigate = useNavigate();
  const { axios, image_base_url } = useAppContext();
  const [upcoming, setUpcoming] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const { data } = await axios.get('/api/show/upcoming');
        if (data.success && data.movies && data.movies.length > 0) {
          // Take the first 5 movies for the slider
          setUpcoming(data.movies.slice(0, 5));
        } else {
          setUpcoming(dummyShowsData.slice(0, 5));
        }
      } catch (error) {
        console.error(error);
        setUpcoming(dummyShowsData.slice(0, 5));
      }
    };
    fetchUpcoming();
  }, [axios]);

  useEffect(() => {
    if (!upcoming || upcoming.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === upcoming.length - 1 ? 0 : prev + 1));
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, [upcoming]);

  if (!upcoming || upcoming.length === 0) {
    return (
      <div className="flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-gray-900 bg-cover bg-center h-screen animate-pulse">
        {/* Placeholder while loading */}
      </div>
    );
  }

  const currentMovie = upcoming[currentSlide];
  const getImageUrl = (path) => path?.startsWith('http') ? path : image_base_url + path;

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Slider Container */}
      <div 
        className="flex h-full w-full transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {upcoming.map((movie, index) => (
          <div 
            key={movie.id} 
            className="flex-shrink-0 h-full w-full flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${getImageUrl(movie.backdrop_path)})` }}
          >
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/50 bg-gradient-to-r from-black/80 to-transparent"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full mt-20 gap-10">
              {/* Text Content */}
              <div className="flex flex-col items-start gap-4 max-w-2xl">
                <h1 className="text-4xl md:text-5xl lg:text-[70px] md:leading-[1.1] font-semibold text-white drop-shadow-lg">
                  {movie.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-gray-300 font-medium">
                  <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm">Upcoming Release</span>
                  <div className="flex items-center gap-1">
                    <Calendar1Icon className="w-4.5 h-4.5" /> 
                    {new Date(movie.release_date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4.5 h-4.5" /> TBD
                  </div>
                </div>
                
                <p className="text-gray-200 line-clamp-3 md:line-clamp-4 leading-relaxed text-sm md:text-base">
                  {movie.overview || "An epic journey unfolds in this highly anticipated upcoming release. Don't miss out on the next big blockbuster hitting theaters near you."}
                </p>
                
                <button 
                  onClick={() => navigate('/releases')} 
                  className="mt-4 flex items-center gap-2 px-6 py-3 text-sm bg-primary hover:bg-primary-dull text-black transition rounded-full font-bold cursor-pointer"
                >
                  View Details
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Poster Image (Hidden on small screens) */}
              <div className="hidden md:block flex-shrink-0 mr-10 lg:mr-20">
                <img 
                  src={getImageUrl(movie.poster_path)} 
                  alt={movie.title + " Poster"} 
                  className="w-64 lg:w-72 rounded-xl shadow-2xl shadow-black/80 border-2 border-gray-700/50"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-2 z-20">
        {upcoming.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index ? 'bg-primary w-8' : 'bg-gray-400 hover:bg-gray-200'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

const HeroSection = ({ mousePosition, isHovering, eyePosition, isBlinking, dollRef }) => {
  return (
    <div className='relative z-10 flex flex-col items-center justify-center min-h-[60vh] sm:min-h-[70vh] text-center responsive-px py-8 sm:py-12'>
      <div className='relative'>
        <h1 className='text-2xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 drop-shadow-2xl transform hover:scale-105 transition-transform duration-500'>
          <span className='block sm:inline'>Welcome to</span>
          <span className='block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse'>
            Quantum Track
          </span>
        </h1>
        <div className='absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl rounded-full'></div>


      </div>

      <p className='text-sm sm:text-base lg:text-lg text-white/90 mb-8 sm:mb-12 max-w-2xl leading-relaxed drop-shadow-lg px-4 sm:px-0'>
       A Quantum-Inspired Job & Career Path Tracker that Predicts, Matches, and Secures Future Work Journeys.
      </p>

      <div className='flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto px-4 sm:px-0'>
        <Link to={"/jobs"} className='interactive responsive-button bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-full shadow-2xl hover:shadow-blue-500/25 transform hover:scale-110 hover:-translate-y-2 transition-all duration-300 border border-white/20 text-center touch-target'>
          Explore Jobs
        </Link>
        <button className='interactive responsive-button bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-full shadow-2xl hover:shadow-purple-500/25 transform hover:scale-110 hover:-translate-y-2 transition-all duration-300 border border-white/20 touch-target'>
          Learn More
        </button>
      </div>

      {/* Floating cards - Hidden on mobile for better performance */}
      <div className='hidden lg:block absolute top-20 left-10 transform rotate-12 hover:rotate-0 transition-transform duration-500 interactive'>
        <div className='w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-400/30 to-purple-500/30 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl'></div>
      </div>
      <div className='hidden lg:block absolute bottom-32 right-10 transform -rotate-12 hover:rotate-0 transition-transform duration-500 interactive'>
        <div className='w-32 h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-pink-400/30 to-purple-500/30 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl'></div>
      </div>
    </div>
  );
};

export default HeroSection;
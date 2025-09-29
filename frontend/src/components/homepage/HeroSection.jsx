import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

const HeroSection = ({ mousePosition, isHovering, eyePosition, isBlinking, dollRef }) => {
  return (
    <div className='relative z-10 flex flex-col items-center justify-center min-h-[70vh] sm:min-h-[80vh] text-center responsive-px py-8 sm:py-12'>
      <div className='relative'>
        <h1 className='text-3xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 drop-shadow-2xl transform hover:scale-105 transition-transform duration-500'>
          <span className='block sm:inline'>Welcome to</span>
          <span className='block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse'>
            Quantum Track
          </span>
        </h1>
        <div className='absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl rounded-full'></div>

        {/* Simple Human Eye behind header text that watches cursor - Desktop only */}
        <div className="hidden lg:block absolute inset-0 flex items-center justify-center pointer-events-none -z-10 opacity-40">
          <div
            ref={dollRef}
            className="relative transform translate-x-25 translate-y-95"
          >
            {/* Simple Human Eye */}
            <div className="relative w-60 h-30 lg:w-80 lg:h-40">
              {/* Eye Shape */}
              <div
                className="w-full h-full relative overflow-hidden"
                style={{
                  clipPath: 'ellipse(50% 100% at 50% 50%)',
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(240,240,240,0.8))'
                }}
              >
                {/* Iris */}
                <div
                  className="absolute w-16 h-16 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 shadow-lg"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  {/* Pupil that follows cursor */}
                  <div
                    className="absolute w-6 h-6 lg:w-10 lg:h-10 bg-black rounded-full transition-all duration-300 ease-out"
                    style={{
                      left: `calc(50% + ${eyePosition.x * 2}px)`,
                      top: `calc(50% + ${eyePosition.y * 2}px)`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    {/* Light reflection */}
                    <div className="absolute top-0.5 left-0.5 lg:top-1 lg:left-1 w-1.5 h-1.5 lg:w-2.5 lg:h-2.5 bg-white rounded-full opacity-90"></div>
                  </div>
                </div>
              </div>

              {/* Eyelids for blinking */}
              <div
                className={`absolute inset-0 bg-gradient-to-b from-orange-100 to-orange-200 transition-all duration-200 ease-out ${isBlinking ? 'opacity-100' : 'opacity-0'
                  }`}
                style={{
                  clipPath: 'ellipse(50% 100% at 50% 50%)'
                }}
              />

              {/* Simple eyebrow */}
              <div
                className="absolute -top-4 lg:-top-6 left-1/2 transform -translate-x-1/2 w-16 h-2 lg:w-24 lg:h-3 bg-amber-800 rounded-full opacity-60"
              />
            </div>

            {/* Glowing effect when hovering */}
            {isHovering && (
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400/30 via-purple-400/30 to-blue-400/30 rounded-full animate-pulse blur-2xl scale-110"></div>
            )}
          </div>
        </div>
      </div>

      <p className='text-base sm:text-lg lg:text-xl text-white/90 mb-8 sm:mb-12 max-w-2xl leading-relaxed drop-shadow-lg px-4 sm:px-0'>
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
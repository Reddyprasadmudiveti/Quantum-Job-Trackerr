import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

const HeroSection = ({ mousePosition, isHovering, eyePosition, isBlinking, dollRef }) => {
  return (
    <div className='relative z-10 flex flex-col items-center justify-center min-h-[80vh] text-center px-6'>
      <div className='relative'>
        <h1 className='text-7xl font-bold text-white mb-6 drop-shadow-2xl transform hover:scale-105 transition-transform duration-500'>
          Welcome to
          <span className='block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse'>
            Quantum Track
          </span>
        </h1>
        <div className='absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl rounded-full'></div>

        {/* Simple Human Eye behind header text that watches cursor */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10 opacity-40">
          <div
            ref={dollRef}
            className="relative transform translate-x-0 translate-y-95"
          >
            {/* Simple Human Eye */}
            <div className="relative w-80 h-40">
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
                  className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 shadow-lg"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  {/* Pupil that follows cursor */}
                  <div
                    className="absolute w-10 h-10 bg-black rounded-full transition-all duration-300 ease-out"
                    style={{
                      left: `calc(50% + ${eyePosition.x * 2}px)`,
                      top: `calc(50% + ${eyePosition.y * 2}px)`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    {/* Light reflection */}
                    <div className="absolute top-1 left-1 w-2.5 h-2.5 bg-white rounded-full opacity-90"></div>
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
                className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-24 h-3 bg-amber-800 rounded-full opacity-60"
              />
            </div>

            {/* Glowing effect when hovering */}
            {isHovering && (
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400/30 via-purple-400/30 to-blue-400/30 rounded-full animate-pulse blur-2xl scale-110"></div>
            )}
          </div>
        </div>
      </div>

      <p className='text-xl text-white/90 mb-12 max-w-2xl leading-relaxed drop-shadow-lg'>
       A Quantum-Inspired Job & Career Path Tracker that Predicts, Matches, and Secures Future Work Journeys.
      </p>

      <div className='flex gap-6'>
        <Link to={"/jobs"} className='interactive px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-full shadow-2xl hover:shadow-blue-500/25 transform hover:scale-110 hover:-translate-y-2 transition-all duration-300 border border-white/20'>
          Explore Jobs
        </Link>
        <button className='interactive px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-full shadow-2xl hover:shadow-purple-500/25 transform hover:scale-110 hover:-translate-y-2 transition-all duration-300 border border-white/20'>
          Learn More
        </button>
      </div>

      {/* Floating cards */}
      <div className='absolute top-20 left-10 transform rotate-12 hover:rotate-0 transition-transform duration-500 interactive'>
        <div className='w-32 h-32 bg-gradient-to-br from-blue-400/30 to-purple-500/30 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl'></div>
      </div>
      <div className='absolute bottom-32 right-10 transform -rotate-12 hover:rotate-0 transition-transform duration-500 interactive'>
        <div className='w-40 h-40 bg-gradient-to-br from-pink-400/30 to-purple-500/30 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl'></div>
      </div>
    </div>
  );
};

export default HeroSection;
import React from 'react';

const TeamSection = () => {
  return (
    <div className='relative z-10 py-10 px-6 overflow-hidden'>
      <div className='max-w-6xl mx-auto'>
        <h2 className='text-5xl font-bold text-white text-center mb-16 drop-shadow-2xl'>
          Meet Our <span className='bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent'>Team</span>
        </h2>

        <div className='relative'>
          <div className='flex gap-8 animate-scroll'>
            <div className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl transform hover:scale-105 transition-all duration-300 text-center min-w-[280px]'>
              <div className='w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center'>
                <span className='text-3xl text-white'>👨‍💻</span>
              </div>
              <h3 className='text-xl font-bold text-white mb-2'>Reddy Prasad</h3>
              <p className='text-purple-300 mb-2'>Developer</p>
              <p className='text-white/70 text-sm'>Over 2 years of experience in Developing Full stack Applications</p>
            </div>

            <div className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl transform hover:scale-105 transition-all duration-300 text-center min-w-[280px]'>
              <div className='w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center'>
                <span className='text-3xl text-white'>👩‍💼</span>
              </div>
              <h3 className='text-xl font-bold text-white mb-2'>Surendra Babu</h3>
              <p className='text-purple-300 mb-2'>Project Co-Ordinator</p>
              <p className='text-white/70 text-sm'>One of the Dare-Dashing Presentator</p>
            </div>

            <div className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl transform hover:scale-105 transition-all duration-300 text-center min-w-[280px]'>
              <div className='w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center'>
                <span className='text-3xl text-white'>👨</span>
              </div>
              <h3 className='text-xl font-bold text-white mb-2'>Aishwarya</h3>
              <p className='text-purple-300 mb-2'>Project Lead</p>
              <p className='text-white/70 text-sm'>One of the Pioneering Team Lead Since 2019</p>
            </div>

            <div className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl transform hover:scale-105 transition-all duration-300 text-center min-w-[280px]'>
              <div className='w-24 h-24 bg-gradient-to-r from-blue-500 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center'>
                <span className='text-3xl text-white'>👩‍🔬</span>
              </div>
              <h3 className='text-xl font-bold text-white mb-2'>Tej Kumar</h3>
              <p className='text-purple-300 mb-2'>Team Organizer</p>
              <p className='text-white/70 text-sm'>One Of the Best Team Organizer Ever</p>
            </div>

            <div className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl transform hover:scale-105 transition-all duration-300 text-center min-w-[280px]'>
              <div className='w-24 h-24 bg-gradient-to-r from-blue-500 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center'>
                <span className='text-3xl text-white'>👩‍🔬</span>
              </div>
              <h3 className='text-xl font-bold text-white mb-2'>Bhavya</h3>
              <p className='text-purple-300 mb-2'>Data Grabber</p>
              <p className='text-white/70 text-sm'>Collect Data From Various Sources</p>
            </div>

            <div className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl transform hover:scale-105 transition-all duration-300 text-center min-w-[280px]'>
              <div className='w-24 h-24 bg-gradient-to-r from-blue-500 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center'>
                <span className='text-3xl text-white'>👨‍💼</span>
              </div>
              <h3 className='text-xl font-bold text-white mb-2'>Bhanu Prasad</h3>
              <p className='text-purple-300 mb-2'>Project Manager</p>
              <p className='text-white/70 text-sm'>Experienced Project Manager with Leadership Skills</p>
            </div>

            {/* Duplicate cards for seamless loop */}
            <div className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl transform hover:scale-105 transition-all duration-300 text-center min-w-[280px]'>
              <div className='w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center'>
                <span className='text-3xl text-white'>👨‍💻</span>
              </div>
              <h3 className='text-xl font-bold text-white mb-2'>Reddy Prasad</h3>
              <p className='text-purple-300 mb-2'>Developer</p>
              <p className='text-white/70 text-sm'>Over 2 years of experience in Developing Full stack Applications</p>
            </div>

            <div className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl transform hover:scale-105 transition-all duration-300 text-center min-w-[280px]'>
              <div className='w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center'>
                <span className='text-3xl text-white'>👩‍💼</span>
              </div>
              <h3 className='text-xl font-bold text-white mb-2'>Surendra Babu</h3>
              <p className='text-purple-300 mb-2'>Project Co-Ordinator</p>
              <p className='text-white/70 text-sm'>One of the Dare-Dashing Presentator</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
      @keyframes scroll {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(-50%);
        }
      }
      
      .animate-scroll {
        animation: scroll 20s linear infinite;
      }
      
      .animate-scroll:hover {
        animation-play-state: paused;
      }
    `}</style>
    </div>
  );
};

export default TeamSection;
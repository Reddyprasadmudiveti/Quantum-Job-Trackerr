import React from 'react';

const FeaturesSection = () => {
  return (
    <div className='relative z-10 py-12 sm:py-16 lg:py-20 responsive-px'>
      <div className='responsive-container'>
        <h2 className='text-2xl sm:text-3xl lg:text-5xl font-bold text-white text-center mb-8 sm:mb-12 lg:mb-16 drop-shadow-2xl'>
          Why Choose <span className='bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>Quantum Track?</span>
        </h2>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
          <div className='interactive bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl transform hover:scale-105 transition-all duration-300 touch-friendly'>
            <div className='w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto'>
              <span className='text-xl sm:text-2xl'>📊</span>
            </div>
            <h3 className='text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4 text-center'>Application Tracking</h3>
            <p className='text-white/80 text-center leading-relaxed text-sm sm:text-base'>Organize and monitor all your job applications in one intuitive dashboard with status updates.</p>
          </div>

          <div className='interactive bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl transform hover:scale-105 transition-all duration-300 touch-friendly'>
            <div className='w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto'>
              <span className='text-xl sm:text-2xl'>📰</span>
            </div>
            <h3 className='text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4 text-center'>Quantum News Feed</h3>
            <p className='text-white/80 text-center leading-relaxed text-sm sm:text-base'>Stay updated with the latest quantum computing news, research breakthroughs, and industry trends.</p>
          </div>

          <div className='interactive bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl transform hover:scale-105 transition-all duration-300 touch-friendly sm:col-span-2 lg:col-span-1'>
            <div className='w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto'>
              <span className='text-xl sm:text-2xl'>📅</span>
            </div>
            <h3 className='text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4 text-center'>Smart Reminders</h3>
            <p className='text-white/80 text-center leading-relaxed text-sm sm:text-base'>Never miss deadlines with customizable alerts for applications, interviews, and follow-ups.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
import React from 'react';

const FeaturesSection = () => {
  return (
    <div className='relative z-10 py-20 px-6'>
      <div className='max-w-6xl mx-auto'>
        <h2 className='text-5xl font-bold text-white text-center mb-16 drop-shadow-2xl'>
          Why Choose <span className='bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>Quantum Job Tracker?</span>
        </h2>

        <div className='grid md:grid-cols-3 gap-8'>
          <div className='interactive bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300'>
            <div className='w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6 mx-auto'>
              <span className='text-2xl'>📊</span>
            </div>
            <h3 className='text-2xl font-bold text-white mb-4 text-center'>Application Tracking</h3>
            <p className='text-white/80 text-center leading-relaxed'>Organize and monitor all your job applications in one intuitive dashboard with status updates.</p>
          </div>

          <div className='interactive bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300'>
            <div className='w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-6 mx-auto'>
              <span className='text-2xl'>📰</span>
            </div>
            <h3 className='text-2xl font-bold text-white mb-4 text-center'>Quantum News Feed</h3>
            <p className='text-white/80 text-center leading-relaxed'>Stay updated with the latest quantum computing news, research breakthroughs, and industry trends.</p>
          </div>

          <div className='interactive bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300'>
            <div className='w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-6 mx-auto'>
              <span className='text-2xl'>📅</span>
            </div>
            <h3 className='text-2xl font-bold text-white mb-4 text-center'>Smart Reminders</h3>
            <p className='text-white/80 text-center leading-relaxed'>Never miss deadlines with customizable alerts for applications, interviews, and follow-ups.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
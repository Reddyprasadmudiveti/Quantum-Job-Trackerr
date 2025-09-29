import React from 'react';

const StatsSection = () => {
  return (
    <div className='relative z-10 py-12 sm:py-16 lg:py-20 responsive-px'>
      <div className='responsive-container'>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center'>
          <div className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl'>
            <div className='text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2'>10,000+</div>
            <div className='text-purple-300 text-xs sm:text-sm lg:text-base'>Active Users</div>
          </div>
          <div className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl'>
            <div className='text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2'>500+</div>
            <div className='text-purple-300 text-xs sm:text-sm lg:text-base'>Quantum Companies</div>
          </div>
          <div className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl'>
            <div className='text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2'>87%</div>
            <div className='text-purple-300 text-xs sm:text-sm lg:text-base'>Success Rate</div>
          </div>
          <div className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl'>
            <div className='text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2'>24/7</div>
            <div className='text-purple-300 text-xs sm:text-sm lg:text-base'>Support Available</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
import React from 'react';

const StatsSection = () => {
  return (
    <div className='relative z-10 py-20 px-6'>
      <div className='max-w-6xl mx-auto'>
        <div className='grid md:grid-cols-4 gap-8 text-center'>
          <div className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl'>
            <div className='text-4xl font-bold text-white mb-2'>1,000+</div>
            <div className='text-purple-300'>Students</div>
          </div>
          <div className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl'>
            <div className='text-4xl font-bold text-white mb-2'>200+</div>
            <div className='text-purple-300'>Faculty Members</div>
          </div>
          <div className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl'>
            <div className='text-4xl font-bold text-white mb-2'>95%</div>
            <div className='text-purple-300'>Placement Rate</div>
          </div>
          <div className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl'>
            <div className='text-4xl font-bold text-white mb-2'>28+</div>
            <div className='text-purple-300'>Years of Excellence</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
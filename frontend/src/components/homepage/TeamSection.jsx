import React from 'react';

const TeamSection = () => {
  return (
    <div className='relative z-10 py-8 sm:py-12 lg:py-16 responsive-px overflow-hidden'>
      <div className='responsive-container'>
        <h2 className='text-2xl sm:text-3xl lg:text-5xl font-bold text-white text-center mb-8 sm:mb-12 lg:mb-16 drop-shadow-2xl'>
          Meet Our <span className='bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent'>Team</span>
        </h2>

        <div className='relative'>
          {/* Mobile: Static grid, Desktop: Scrolling animation */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:hidden'>
            <TeamCard 
              name="Reddy Prasad"
              role="Developer & Team Lead"
              description="Over 2 years of experience in Developing Full stack Applications"
              emoji="👨‍💻"
              gradient="from-blue-500 to-purple-600"
            />
            <TeamCard 
              name="Surendra Babu"
              role="Project Co-Ordinator & presenter"
              description="One of the Dare-Dashing Presentator"
              emoji="👨‍💼"
              gradient="from-purple-500 to-pink-600"
            />
            <TeamCard 
              name="Aishwarya"
              role="Designer"
              description="Over 2 years of experience in designing websites"
              emoji="👨"
              gradient="from-pink-500 to-purple-600"
            />
            <TeamCard 
              name="Tej Kumar"
              role="Team Organizer & Data Scientist"
              description="One Of the Best Team Organizer Ever"
              emoji="👩‍🔬"
              gradient="from-blue-500 to-pink-600"
            />
            <TeamCard 
              name="Bhavya"
              role="Designer"
              description="Over 1 years of experience in designing websites"
              emoji="👩‍🔬"
              gradient="from-blue-500 to-pink-600"
            />
            <TeamCard 
              name="Bhanu Prasad"
              role="R&D "
              description="R&D Co-Ordiation"
              emoji="👨‍💼"
              gradient="from-blue-500 to-pink-600"
            />
          </div>

          {/* Desktop: Scrolling animation */}
          <div className='hidden lg:block'>
            <div className='flex gap-6 xl:gap-8 animate-scroll'>
              <TeamCard 
                name="Reddy Prasad"
                role="Developer & Team Lead"
                description="Over 2 years of experience in Developing Full stack Applications"
                emoji="👨‍💻"
                gradient="from-blue-500 to-purple-600"
                isScrolling={true}
              />
              <TeamCard 
                name="Surendra Babu"
                role="Project Co-Ordinator & presenter"
                description="One of the Dare-Dashing Presentator"
                emoji="👨"
                gradient="from-purple-500 to-pink-600"
                isScrolling={true}
              />
              <TeamCard 
                name="Aishwarya"
                role="Designer"
                description="Over 2 years of experience in designing websites"
                emoji="👩‍💼"
                gradient="from-pink-500 to-purple-600"
                isScrolling={true}
              />
              <TeamCard 
                name="Tej Kumar"
                role="Team Organizer & Data Scientist"
                description="One Of the Best Team Organizer Ever"
                emoji="👨‍💼"
                gradient="from-blue-500 to-pink-600"
                isScrolling={true}
              />
              <TeamCard 
                name="Bhavya"
                role="Designer"
                description="Over 1 years of experience in designing websites"
                emoji="👩‍🔬"
                gradient="from-blue-500 to-pink-600"
                isScrolling={true}
              />
              <TeamCard 
                name="Bhanu Prasad"
                role="R&D & "
                description="Experienced Project Manager with Leadership Skills"
                emoji="👨‍💼"
                gradient="from-blue-500 to-pink-600"
                isScrolling={true}
              />

              {/* Duplicate cards for seamless loop */}
              <TeamCard 
                name="Reddy Prasad"
                role="Developer"
                description="Over 2 years of experience in Developing Full stack Applications"
                emoji="👨‍💻"
                gradient="from-blue-500 to-purple-600"
                isScrolling={true}
              />
              <TeamCard 
                name="Surendra Babu"
                role="Project Co-Ordinator"
                description="One of the Dare-Dashing Presentator"
                emoji="👨‍💼"
                gradient="from-purple-500 to-pink-600"
                isScrolling={true}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
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

// Reusable TeamCard component
const TeamCard = ({ name, role, description, emoji, gradient, isScrolling = false }) => (
  <div className={`bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl transform hover:scale-105 transition-all duration-300 text-center ${isScrolling ? 'min-w-[280px]' : ''}`}>
    <div className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-r ${gradient} rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center`}>
      <span className='text-xl sm:text-2xl lg:text-3xl text-white'>{emoji}</span>
    </div>
    <h3 className='text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2'>{name}</h3>
    <p className='text-purple-300 mb-1 sm:mb-2 text-sm sm:text-base'>{role}</p>
    <p className='text-white/70 text-xs sm:text-sm'>{description}</p>
  </div>
);

export default TeamSection;
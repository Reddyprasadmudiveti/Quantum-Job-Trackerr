import React from 'react';

const FAQSection = ({ faqs, openFAQ, toggleFAQ }) => {
  return (
    <div className='relative z-10 py-12 sm:py-16 lg:py-20 responsive-px'>
      <div className='max-w-4xl mx-auto'>
        <h2 className='text-2xl sm:text-3xl lg:text-5xl font-bold text-white text-center mb-8 sm:mb-12 lg:mb-16 drop-shadow-2xl'>
          Questions? We have <span className='bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>Answers</span>
        </h2>

        <div className='space-y-4 sm:space-y-6'>
          {faqs.map((faq, index) => (
            <div key={index} className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden'>
              <button
                onClick={() => toggleFAQ(index)}
                className='w-full p-4 sm:p-6 text-left flex justify-between items-center hover:bg-white/5 transition-all duration-300 touch-target'
              >
                <h3 className='text-base sm:text-lg lg:text-xl font-bold text-white pr-4'>{faq.question}</h3>
                <span className={`text-white text-lg sm:text-xl lg:text-2xl transform transition-transform duration-300 flex-shrink-0 ${openFAQ === index ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className='px-4 sm:px-6 pb-4 sm:pb-6'>
                  <p className='text-white/80 leading-relaxed text-sm sm:text-base'>{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
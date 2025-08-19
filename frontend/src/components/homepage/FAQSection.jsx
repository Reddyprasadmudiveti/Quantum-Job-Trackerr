import React from 'react';

const FAQSection = ({ faqs, openFAQ, toggleFAQ }) => {
  return (
    <div className='relative z-10 py-20 px-6'>
      <div className='max-w-4xl mx-auto'>
        <h2 className='text-5xl font-bold text-white text-center mb-16 drop-shadow-2xl'>
          Frequently Asked <span className='bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>Questions</span>
        </h2>

        <div className='space-y-6'>
          {faqs.map((faq, index) => (
            <div key={index} className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl overflow-hidden'>
              <button
                onClick={() => toggleFAQ(index)}
                className='w-full p-6 text-left flex justify-between items-center hover:bg-white/5 transition-all duration-300'
              >
                <h3 className='text-xl font-bold text-white'>{faq.question}</h3>
                <span className={`text-white text-2xl transform transition-transform duration-300 ${openFAQ === index ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className='px-6 pb-6'>
                  <p className='text-white/80 leading-relaxed'>{faq.answer}</p>
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
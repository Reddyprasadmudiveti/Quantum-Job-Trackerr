import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const HomePage = () => {
  const [openFAQ, setOpenFAQ] = useState(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 })
  const [isBlinking, setIsBlinking] = useState(false)
  const cursorRef = useRef(null)
  const cursorDotRef = useRef(null)
  const dollRef = useRef(null)

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  // Cursor tracking effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    // Add event listeners to interactive elements
    const interactiveElements = document.querySelectorAll('button, a, .interactive')

    document.addEventListener('mousemove', handleMouseMove)
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    })

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [])

  // Smooth cursor animation
  useEffect(() => {
    const cursor = cursorRef.current
    const cursorDot = cursorDotRef.current

    if (cursor && cursorDot) {
      const moveCursor = () => {
        cursor.style.left = mousePosition.x + 'px'
        cursor.style.top = mousePosition.y + 'px'

        cursorDot.style.left = mousePosition.x + 'px'
        cursorDot.style.top = mousePosition.y + 'px'
      }

      requestAnimationFrame(moveCursor)
    }
  }, [mousePosition])

  // Doll eye tracking effect
  useEffect(() => {
    const doll = dollRef.current
    if (doll) {
      const dollRect = doll.getBoundingClientRect()
      const dollCenterX = dollRect.left + dollRect.width / 2
      const dollCenterY = dollRect.top + dollRect.height / 2

      // Calculate angle between doll and cursor
      const deltaX = mousePosition.x - dollCenterX
      const deltaY = mousePosition.y - dollCenterY
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

      // Limit eye movement within the eye socket
      const maxEyeMovement = 8
      const eyeX = Math.max(-maxEyeMovement, Math.min(maxEyeMovement, (deltaX / distance) * maxEyeMovement))
      const eyeY = Math.max(-maxEyeMovement, Math.min(maxEyeMovement, (deltaY / distance) * maxEyeMovement))

      setEyePosition({ x: eyeX || 0, y: eyeY || 0 })
    }
  }, [mousePosition])

  // Random blinking effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      // Random blink every 2-5 seconds
      const randomDelay = Math.random() * 3000 + 2000;
      setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150); // Blink duration
      }, randomDelay);
    }, 5000);

    return () => clearInterval(blinkInterval);
  }, [])

  // Occasional double blink
  useEffect(() => {
    const doubleBlink = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance of double blink
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          setTimeout(() => {
            setIsBlinking(true);
            setTimeout(() => setIsBlinking(false), 120);
          }, 200);
        }, 120);
      }
    }, 8000);

    return () => clearInterval(doubleBlink);
  }, [])

  const faqs = [
    {
      question: "How do I apply for jobs through the portal?",
      answer: "Simply create an account, complete your profile, and browse through our extensive job listings. You can apply directly through the platform with just one click."
    },
    {
      question: "What types of jobs are available?",
      answer: "We offer opportunities across various industries including technology, healthcare, finance, education, and more. From entry-level positions to senior roles, there's something for everyone."
    },
    {
      question: "Is the job portal free to use?",
      answer: "Yes, our job portal is completely free for job seekers. You can create profiles, search jobs, and apply without any charges."
    },
    {
      question: "How often are new jobs posted?",
      answer: "New job opportunities are posted daily. We recommend checking the portal regularly and setting up job alerts to stay updated with the latest openings."
    },
    {
      question: "Do you provide career guidance and support?",
      answer: "Absolutely! We offer comprehensive career guidance, resume building assistance, interview preparation, and ongoing support throughout your job search journey."
    },
    {
      question: "Can I edit my profile after creating it?",
      answer: "Yes, you can update and edit your profile at any time. We encourage keeping your profile current with your latest skills, experience, and achievements to attract better opportunities."
    },
    {
      question: "How do I get notified about new job openings?",
      answer: "You can set up personalized job alerts based on your preferences such as location, industry, salary range, and job type. You'll receive email notifications when matching jobs are posted."
    },
    {
      question: "What should I include in my profile to stand out?",
      answer: "Include a professional photo, detailed work experience, relevant skills, educational background, certifications, and a compelling summary. Also, add portfolio links or project examples if applicable."
    },
    {
      question: "How long does the application process typically take?",
      answer: "The timeline varies by employer, but most companies respond within 1-2 weeks. Some may have multiple interview rounds which can extend the process to 3-4 weeks."
    },
    {
      question: "Can I apply for multiple jobs at the same time?",
      answer: "Yes, you can apply for as many positions as you'd like. We recommend tailoring your application for each role to increase your chances of success."
    },
    {
      question: "Do you offer internship opportunities?",
      answer: "Yes, we have a dedicated section for internships and entry-level positions. These are great opportunities for students and recent graduates to gain valuable experience."
    },
    {
      question: "Is Dravidian University Good?",
      answer: "Yes, Dravidian University is an excellent institution known for its academic excellence, experienced faculty, and strong industry connections. With a 95% placement rate and 28+ years of educational excellence, we provide world-class education and comprehensive career support to help students achieve their goals."
    }
  ]

  return (
    <div className="cursor-none">
      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className={`fixed pointer-events-none z-50 w-8 h-8 rounded-full border-2 border-purple-400 transition-all duration-300 ease-out ${isHovering ? 'scale-150 border-pink-400 bg-pink-400/20' : 'scale-100'
          }`}
        style={{
          transform: 'translate(-50%, -50%)',
          mixBlendMode: 'difference'
        }}
      />
      <div
        ref={cursorDotRef}
        className="fixed pointer-events-none z-50 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-100 ease-out"
        style={{
          transform: 'translate(-50%, -50%)'
        }}
      />

      {/* Cursor Trail Effect */}
      <div
        className="fixed pointer-events-none z-40 w-32 h-32 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-xl transition-all duration-500 ease-out"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: 'translate(-50%, -50%)'
        }}
      />

      <div>
        <div className='relative z-10 flex flex-col items-center justify-center min-h-[80vh] text-center px-6'>
          <div className='relative'>
            <h1 className='text-7xl font-bold text-white mb-6 drop-shadow-2xl transform hover:scale-105 transition-transform duration-500'>
              Welcome to
              <span className='block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse'>
                Quantum Job Tracker
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
            Discover endless opportunities and shape your future with our comprehensive job portal.
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

        <div className='relative z-10 py-20 px-6'>
          <div className='max-w-6xl mx-auto'>
            <h2 className='text-5xl font-bold text-white text-center mb-16 drop-shadow-2xl'>
              Why Choose <span className='bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>Dravidian University?</span>
            </h2>

            <div className='grid md:grid-cols-3 gap-8'>
              <div className='interactive bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300'>
                <div className='w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6 mx-auto'>
                  <span className='text-2xl'>🎓</span>
                </div>
                <h3 className='text-2xl font-bold text-white mb-4 text-center'>Academic Excellence</h3>
                <p className='text-white/80 text-center leading-relaxed'>World-class education with cutting-edge curriculum and experienced faculty members.</p>
              </div>

              <div className='interactive bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300'>
                <div className='w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-6 mx-auto'>
                  <span className='text-2xl'>💼</span>
                </div>
                <h3 className='text-2xl font-bold text-white mb-4 text-center'>Career Opportunities</h3>
                <p className='text-white/80 text-center leading-relaxed'>Extensive job portal connecting students with top employers and career guidance.</p>
              </div>

              <div className='interactive bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300'>
                <div className='w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-6 mx-auto'>
                  <span className='text-2xl'>🌟</span>
                </div>
                <h3 className='text-2xl font-bold text-white mb-4 text-center'>Innovation Hub</h3>
                <p className='text-white/80 text-center leading-relaxed'>State-of-the-art facilities fostering research, innovation, and entrepreneurship.</p>
              </div>
            </div>
          </div>
        </div>

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

        {/* FAQ Section */}
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

        {/* Statistics Section */}
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

        {/* Particle effect that follows cursor */}
        <div
          className="fixed pointer-events-none z-30"
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
          <div className="w-1 h-1 bg-purple-400 rounded-full animate-ping animation-delay-200 absolute top-2 left-2"></div>
          <div className="w-1 h-1 bg-pink-400 rounded-full animate-ping animation-delay-400 absolute top-1 left-3"></div>
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

        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        /* Hide default cursor on the entire page */
        * {
          cursor: none !important;
        }

        /* Smooth cursor movement */
        .cursor-none * {
          cursor: none !important;
        }
      `}</style>
      </div>
    </div>
  )
}

export default HomePage
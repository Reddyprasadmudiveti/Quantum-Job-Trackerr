import React, { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import LazySection from '../components/homepage/LazySection'

// Lazy load components
const HeroSection = lazy(() => import('../components/homepage/HeroSection'))
const FeaturesSection = lazy(() => import('../components/homepage/FeaturesSection'))
const TeamSection = lazy(() => import('../components/homepage/TeamSection'))
const FAQSection = lazy(() => import('../components/homepage/FAQSection'))
const StatsSection = lazy(() => import('../components/homepage/StatsSection'))
const CursorEffects = lazy(() => import('../components/homepage/CursorEffects'))

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
      question: "What is Quantum Track?",
      answer: "Quantum Job Tracker is a comprehensive platform designed to help you manage your job applications, track your progress, and organize your quantum computing career opportunities in one place."
    },
    {
      question: "How do I track my job applications?",
      answer: "Simply create an account, add your job applications, and use our intuitive dashboard to monitor status, deadlines, and follow-ups. You can categorize applications by status, company, and priority."
    },
    {
      question: "What types of jobs can I track?",
      answer: "Our platform specializes in quantum computing careers, but you can track any job application across various industries including technology, research, academia, and quantum-focused companies."
    },
    {
      question: "Is Quantum Job Tracker free to use?",
      answer: "Yes, our core tracking features are completely free. Premium features with advanced analytics and unlimited application tracking are available through subscription plans."
    },
    {
      question: "How does the RSS news feed work?",
      answer: "Our integrated RSS feed aggregates the latest news from quantum computing sources, research publications, and industry updates to keep you informed about developments relevant to your career."
    },
    {
      question: "Can I set reminders for application deadlines?",
      answer: "Yes, you can set custom reminders for application deadlines, interview dates, and follow-ups. Notifications can be received via email or in-app alerts based on your preferences."
    },
    {
      question: "How do I organize multiple job applications?",
      answer: "Our kanban-style board lets you visualize your application pipeline. Drag and drop applications between status columns (Applied, Interview, Offer, Rejected) to maintain a clear overview of your job search progress."
    },
    {
      question: "What information should I track for each application?",
      answer: "We recommend tracking company name, position, application date, contact details, application materials submitted, interview dates, salary information, and any notes from interactions with recruiters."
    },
    {
      question: "Can I generate reports on my job search?",
      answer: "Yes, our analytics dashboard provides insights into your application success rate, interview conversion rate, and overall job search metrics to help you optimize your strategy."
    },
    {
      question: "Is my data secure on the platform?",
      answer: "Absolutely. We employ industry-standard encryption and security practices to ensure your personal information and job application data remain private and protected."
    },
    {
      question: "Can I access Quantum Job Tracker on mobile devices?",
      answer: "Yes, our platform is fully responsive and works seamlessly across desktop, tablet, and mobile devices, allowing you to track your job search progress anywhere, anytime."
    },
    {
      question: "How can I get support if I have questions?",
      answer: "Our dedicated support team is available via chat and email. We also offer comprehensive documentation, video tutorials, and a community forum where users can share tips and best practices."
    }
  ]

  return (
    <div className="cursor-none overflow-x-hidden">
      {/* Cursor Effects - Desktop only */}
      <div className="hidden lg:block">
        <CursorEffects 
          mousePosition={mousePosition} 
          isHovering={isHovering} 
          cursorRef={cursorRef} 
          cursorDotRef={cursorDotRef} 
        />
      </div>

      {/* Hero Section - Load immediately, outside Suspense */}
      <HeroSection 
        mousePosition={mousePosition} 
        isHovering={isHovering} 
        eyePosition={eyePosition} 
        isBlinking={isBlinking} 
        dollRef={dollRef} 
      />

      <div>
          {/* Features Section - Lazy load */}
          <Suspense fallback={
            <div className="section-placeholder py-8 sm:py-12 lg:py-16">
              <div className="responsive-container">
                {/* Title placeholder - responsive */}
                <div className="skeleton-pulse h-8 sm:h-10 lg:h-12 w-3/4 mx-auto mb-8 sm:mb-12 lg:mb-16 rounded-lg"></div>
                
                {/* Features cards placeholder - responsive grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl">
                      {/* Icon placeholder - responsive */}
                      <div className="skeleton-pulse-circle w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full mx-auto mb-4 sm:mb-5 lg:mb-6"></div>
                      {/* Title placeholder - responsive */}
                      <div className="skeleton-pulse h-5 sm:h-6 w-3/4 mx-auto mb-3 sm:mb-4 rounded-lg"></div>
                      {/* Text placeholder - responsive */}
                      <div className="skeleton-pulse h-3 sm:h-4 w-full mx-auto mb-2 rounded-lg"></div>
                      <div className="skeleton-pulse h-3 sm:h-4 w-5/6 mx-auto rounded-lg"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          }>
            <LazySection>
              <FeaturesSection />
            </LazySection>
          </Suspense>

          {/* Team Section - Lazy load */}
          <Suspense fallback={
            <div className="section-placeholder py-8 sm:py-12 lg:py-16">
              <div className="responsive-container">
                {/* Title placeholder - responsive */}
                <div className="skeleton-pulse h-8 sm:h-10 lg:h-12 w-1/2 sm:w-2/5 mx-auto mb-8 sm:mb-12 lg:mb-16 rounded-lg"></div>
                
                {/* Team cards placeholder - responsive layout */}
                <div className="relative">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:gap-6 xl:gap-8 gap-4 sm:gap-6 lg:overflow-x-hidden">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl lg:min-w-[280px] text-center">
                        {/* Avatar placeholder - responsive */}
                        <div className="skeleton-pulse-circle w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded mx-auto mb-3 sm:mb-4"></div>
                        {/* Name placeholder - responsive */}
                        <div className="skeleton-pulse h-4 sm:h-5 w-3/4 mx-auto mb-2 rounded-lg"></div>
                        {/* Role placeholder - responsive */}
                        <div className="skeleton-pulse h-3 sm:h-4 w-1/2 mx-auto mb-2 rounded-lg"></div>
                        {/* Bio placeholder - responsive */}
                        <div className="skeleton-pulse h-3 w-5/6 mx-auto rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          }>
            <LazySection>
              <TeamSection />
            </LazySection>
          </Suspense>

          {/* FAQ Section - Lazy load */}
          <Suspense fallback={
            <div className="section-placeholder py-8 sm:py-12 lg:py-16">
              <div className="max-w-4xl mx-auto responsive-px">
                {/* Title placeholder - responsive */}
                <div className="skeleton-pulse h-6 sm:h-8 w-4/5 mx-auto mb-8 sm:mb-12 lg:mb-16 rounded-lg"></div>
                
                {/* FAQ items placeholder - responsive */}
                <div className="space-y-4 sm:space-y-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
                      <div className="p-4 sm:p-6 flex justify-between items-center">
                        {/* Question placeholder - responsive */}
                        <div className="skeleton-pulse h-5 sm:h-6 w-4/5 rounded-lg"></div>
                        {/* Arrow placeholder - responsive */}
                        <div className="skeleton-pulse h-5 w-5 sm:h-6 sm:w-6 rounded-full"></div>
                      </div>
                      {/* First item shows a hint of the answer area */}
                      {i === 1 && (
                        <div className="px-4 sm:px-6 pb-4 sm:pb-6 opacity-30">
                          <div className="skeleton-pulse h-3 sm:h-4 w-full rounded-lg mb-2"></div>
                          <div className="skeleton-pulse h-3 sm:h-4 w-5/6 rounded-lg"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          }>
            <LazySection>
              <FAQSection 
                faqs={faqs} 
                openFAQ={openFAQ} 
                toggleFAQ={toggleFAQ} 
              />
            </LazySection>
          </Suspense>

          {/* Stats Section - Lazy load */}
          <Suspense fallback={
            <div className="section-placeholder py-8 sm:py-12 lg:py-16">
              <div className="responsive-container">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl">
                      {/* Number placeholder - responsive */}
                      <div className="skeleton-pulse h-6 sm:h-8 lg:h-10 w-1/2 mx-auto mb-2 rounded-lg"></div>
                      {/* Label placeholder - responsive */}
                      <div className="skeleton-pulse h-4 sm:h-5 w-3/4 mx-auto rounded-lg"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          }>
            <LazySection>
              <StatsSection />
            </LazySection>
          </Suspense>

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

            .animation-delay-200 {
              animation-delay: 0.2s;
            }
            
            .animation-delay-400 {
              animation-delay: 0.4s;
            }

            /* Hide default cursor on desktop only */
            @media (min-width: 1024px) {
              * {
                cursor: none !important;
              }

              .cursor-none * {
                cursor: none !important;
              }
            }

            /* Section placeholder for lazy loading */
            .section-placeholder {
              width: 100%;
              border-radius: 1rem;
              margin: 2rem 0;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
            }
            
            /* Skeleton pulse animation for text elements */
            .skeleton-pulse {
              background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
              background-size: 200% 100%;
              animation: shimmer 1.5s infinite;
              border-radius: 0.5rem;
              position: relative;
              overflow: hidden;
            }
            
            .skeleton-pulse::after {
              content: '';
              position: absolute;
              top: 0;
              right: 0;
              bottom: 0;
              left: 0;
              transform: translateX(-100%);
              background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
              animation: shine 2s infinite;
            }
            
            /* Skeleton pulse animation for circular elements */
            .skeleton-pulse-circle {
              background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
              background-size: 200% 100%;
              animation: shimmer 1.5s infinite;
              position: relative;
              overflow: hidden;
            }
            
            .skeleton-pulse-circle::after {
              content: '';
              position: absolute;
              top: 0;
              right: 0;
              bottom: 0;
              left: 0;
              transform: translateX(-100%);
              background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
              animation: shine 2s infinite;
              border-radius: 50%;
            }
            
            @keyframes shimmer {
              0% {
                background-position: 200% 0;
              }
              100% {
                background-position: -200% 0;
              }
            }
            
            @keyframes shine {
              100% { transform: translateX(100%); }
            }
          `}</style>
        </div>
    </div>
  )
}

export default HomePage
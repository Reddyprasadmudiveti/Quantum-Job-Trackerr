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
      {/* Cursor Effects - Always visible, outside Suspense */}
      <CursorEffects 
        mousePosition={mousePosition} 
        isHovering={isHovering} 
        cursorRef={cursorRef} 
        cursorDotRef={cursorDotRef} 
      />

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
            <div className="section-placeholder" style={{ height: '500px' }}>
              <div className="max-w-6xl mx-auto px-6">
                {/* Title placeholder - matches "Why Choose Dravidian University?" */}
                <div className="skeleton-pulse h-12 w-3/4 mx-auto mb-16 rounded-lg"></div>
                
                {/* Features cards placeholder - matches the 3 feature cards */}
                <div className="grid md:grid-cols-3 gap-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
                      {/* Icon placeholder - matches the gradient circle with emoji */}
                      <div className="skeleton-pulse-circle w-16 h-16 rounded-full mx-auto mb-6"></div>
                      {/* Title placeholder - matches "Academic Excellence", etc. */}
                      <div className="skeleton-pulse h-6 w-3/4 mx-auto mb-4 rounded-lg"></div>
                      {/* Text placeholder - matches the description paragraph */}
                      <div className="skeleton-pulse h-4 w-full mx-auto mb-2 rounded-lg"></div>
                      <div className="skeleton-pulse h-4 w-5/6 mx-auto rounded-lg"></div>
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
            <div className="section-placeholder" style={{ height: '550px' }}>
              <div className="max-w-6xl mx-auto px-6">
                {/* Title placeholder - matches "Meet Our Team" */}
                <div className="skeleton-pulse h-12 w-2/4 mx-auto mb-16 rounded-lg"></div>
                
                {/* Team cards placeholder - horizontal scroll with animation */}
                <div className="relative">
                  <div className="flex gap-8" style={{ overflowX: 'hidden' }}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl min-w-[280px] text-center">
                        {/* Avatar placeholder - matches the gradient circle with emoji */}
                        <div className="skeleton-pulse-circle w-24 h-24 rounded mx-auto mb-4"></div>
                        {/* Name placeholder - matches "Reddy Prasad", etc. */}
                        <div className="skeleton-pulse h-5 w-3/4 mx-auto mb-2 rounded-lg"></div>
                        {/* Role placeholder - matches "Developer", etc. */}
                        <div className="skeleton-pulse h-4 w-1/2 mx-auto mb-2 rounded-lg"></div>
                        {/* Bio placeholder - matches the description text */}
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
            <div className="section-placeholder" style={{ height: '600px' }}>
              <div className="max-w-4xl mx-auto px-6">
                {/* Title placeholder - matches "Frequently Asked Questions" */}
                <div className="skeleton-pulse h-8 w-4/5 mx-auto mb-16 rounded-lg"></div>
                
                {/* FAQ items placeholder - matches the expandable FAQ items */}
                <div className="space-y-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
                      <div className="p-6 flex justify-between items-center">
                        {/* Question placeholder - matches the question text */}
                        <div className="skeleton-pulse h-6 w-4/5 rounded-lg"></div>
                        {/* Arrow placeholder - matches the dropdown arrow */}
                        <div className="skeleton-pulse h-6 w-6 rounded-full"></div>
                      </div>
                      {/* First item shows a hint of the answer area */}
                      {i === 1 && (
                        <div className="px-6 pb-6 opacity-30">
                          <div className="skeleton-pulse h-4 w-full rounded-lg mb-2"></div>
                          <div className="skeleton-pulse h-4 w-5/6 rounded-lg"></div>
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
            <div className="section-placeholder" style={{ height: '300px' }}>
              <div className="max-w-6xl mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-8 text-center">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
                      {/* Number placeholder - matches "1,000+", "200+", "95%", "28+" */}
                      <div className="skeleton-pulse h-10 w-1/2 mx-auto mb-2 rounded-lg"></div>
                      {/* Label placeholder - matches "Students", "Faculty Members", etc. */}
                      <div className="skeleton-pulse h-5 w-3/4 mx-auto rounded-lg"></div>
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
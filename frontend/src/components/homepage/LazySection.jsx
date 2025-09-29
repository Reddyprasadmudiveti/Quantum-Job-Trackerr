import React, { useEffect, useRef, useState } from 'react';

const LazySection = ({ children, threshold = 0.2 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const [dimensions, setDimensions] = useState({ height: 'auto', width: '100%' });

  // Function to render children off-screen and capture dimensions
  const measureChildren = () => {
    if (!contentRef.current) return;
    
    // Create a hidden div to measure content
    const hiddenDiv = document.createElement('div');
    hiddenDiv.style.position = 'absolute';
    hiddenDiv.style.visibility = 'hidden';
    hiddenDiv.style.width = '100%';
    document.body.appendChild(hiddenDiv);
    
    // Temporarily render children to measure
    const tempRoot = document.createElement('div');
    hiddenDiv.appendChild(tempRoot);
    
    // We can't use ReactDOM.render directly, so we'll use a simpler approach
    // Just create a placeholder with approximate dimensions based on content type
    const childrenType = children?.type?.name || 'Section';
    
    // Set default heights based on section type
    let defaultHeight = 400; // Default height
    
    if (childrenType.includes('Hero')) {
      defaultHeight = 600;
    } else if (childrenType.includes('Features')) {
      defaultHeight = 500;
    } else if (childrenType.includes('Team')) {
      defaultHeight = 550;
    } else if (childrenType.includes('FAQ')) {
      defaultHeight = 600;
    } else if (childrenType.includes('Stats')) {
      defaultHeight = 300;
    }
    
    setDimensions({ height: defaultHeight + 'px', width: '100%' });
    
    // Clean up
    document.body.removeChild(hiddenDiv);
  };

  useEffect(() => {
    // Measure content dimensions when component mounts
    measureChildren();
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the section becomes visible in the viewport
        if (entry.isIntersecting) {
          // Start loading the content
          setIsVisible(true);
          
          // Simulate a small delay to prevent flickering
          setTimeout(() => {
            setIsLoading(false);
          }, 300);
          
          // Once visible, no need to observe anymore
          observer.unobserve(sectionRef.current);
        }
      },
      { threshold, rootMargin: '100px 0px' } // Load content slightly before it comes into view
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [threshold, children]);

  return (
    <div ref={sectionRef} className="section-container">
      {isVisible ? (
        <div 
          ref={contentRef}
          className="transition-all duration-700 ease-in-out transform" 
          style={{ 
            opacity: isLoading ? 0 : 1,
            transform: isLoading ? 'translateY(10px)' : 'translateY(0)'
          }}
        >
          {children}
        </div>
      ) : (
        <div 
          className="content-placeholder" 
          style={{ 
            height: dimensions.height,
            width: dimensions.width
          }}
        >
          <div className="loading-indicator">
            <div className="skeleton-pulse"></div>
            <div className="skeleton-pulse" style={{ width: '70%' }}></div>
            <div className="skeleton-pulse" style={{ width: '85%' }}></div>
          </div>
        </div>
      )}
      
      <style>{`
        .section-container {
          position: relative;
          width: 100%;
        }
        
        .content-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }
        
        .loading-indicator {
          width: 80%;
          max-width: 800px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .skeleton-pulse {
          height: 30px;
          width: 100%;
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 0.5rem;
        }
        
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

export default LazySection;
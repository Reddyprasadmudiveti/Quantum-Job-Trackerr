import React from 'react';

const CursorEffects = ({ mousePosition, isHovering, cursorRef, cursorDotRef }) => {
  return (
    <>
      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className={`fixed pointer-events-none z-50 w-8 h-8 rounded-full border-2 border-purple-400 transition-all duration-300 ease-out ${isHovering ? 'scale-150 border-pink-400 bg-pink-400/20' : 'scale-100'}`}
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

      <style>{`
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
    </>
  );
};

export default CursorEffects;
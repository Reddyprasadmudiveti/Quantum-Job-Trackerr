import React from 'react'
import { Link } from 'react-router-dom'

const FooterPage = () => {
  return (
    <footer className='relative z-10 bg-black/30 backdrop-blur-lg border-t border-white/20 py-16 px-6'>
    <div className='max-w-6xl mx-auto'>
      <div className='grid md:grid-cols-4 gap-8'>
        {/* University Info */}
        <div>
          <div className='flex items-center gap-4 mb-6'>
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/e/ea/Dravidian_University_logo.png" 
              height={50} 
              width={50} 
              alt="University Logo" 
              className='rounded-full shadow-lg'
            />
            <div className='text-xl font-bold text-white'>Dravidian University</div>
          </div>
          <p className='text-white/70 mb-4'>Empowering minds, shaping futures, and creating leaders for tomorrow's world.</p>
          <div className='flex gap-4'>
            <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform'>
              <span className='text-white'>📘</span>
            </div>
            <div className='w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform'>
              <span className='text-white'>📷</span>
            </div>
            <div className='w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform'>
              <span className='text-white'>🐦</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className='text-xl font-bold text-white mb-6'>Quick Links</h3>
          <ul className='space-y-3'>
            <li><Link to="/" className='text-white/70 hover:text-white transition-colors'>Home</Link></li>
            <li><Link to="/about" className='text-white/70 hover:text-white transition-colors'>About Us</Link></li>
            <li><Link to="/admissions" className='text-white/70 hover:text-white transition-colors'>Admissions</Link></li>
            <li><Link to="/academics" className='text-white/70 hover:text-white transition-colors'>Academics</Link></li>
            <li><Link to="/research" className='text-white/70 hover:text-white transition-colors'>Research</Link></li>
          </ul>
        </div>

        {/* Student Services */}
        <div>
          <h3 className='text-xl font-bold text-white mb-6'>Student Services</h3>
          <ul className='space-y-3'>
            <li><Link to="/jobs" className='text-white/70 hover:text-white transition-colors'>Job Portal</Link></li>
            <li><Link to="/library" className='text-white/70 hover:text-white transition-colors'>Library</Link></li>
            <li><Link to="/hostel" className='text-white/70 hover:text-white transition-colors'>Hostel</Link></li>
            <li><Link to="/sports" className='text-white/70 hover:text-white transition-colors'>Sports</Link></li>
            <li><Link to="/clubs" className='text-white/70 hover:text-white transition-colors'>Student Clubs</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className='text-xl font-bold text-white mb-6'>Contact Us</h3>
          <div className='space-y-3 text-white/70'>
            <div className='flex items-center gap-3'>
              <span>📍</span>
              <span>Kuppam, Andhra Pradesh, India</span>
            </div>
            <div className='flex items-center gap-3'>
              <span>📞</span>
              <span>+91 8571-255000</span>
            </div>
            <div className='flex items-center gap-3'>
              <span>✉️</span>
              <span>info@dravidianuniversity.ac.in</span>
            </div>
            <div className='flex items-center gap-3'>
              <span>🌐</span>
              <span>www.dravidianuniversity.ac.in</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className='border-t border-white/20 mt-12 pt-8 text-center'>
        <p className='text-white/70'>
          © 2024 Dravidian University. All rights reserved. | 
          <Link to="/privacy" className='hover:text-white transition-colors ml-2'>Privacy Policy</Link> | 
          <Link to="/terms" className='hover:text-white transition-colors ml-2'>Terms of Service</Link>
        </p>
      </div>
    </div>
  </footer>
  )
}

export default FooterPage
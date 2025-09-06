import React from 'react'
import { Link } from 'react-router-dom'

const FooterPage = () => {
  return (
    <footer className='relative z-10 bg-black/30 backdrop-blur-lg border-t border-white/20 py-16 px-6'>
    <div className='max-w-6xl mx-auto'>
      <div className='grid md:grid-cols-4 gap-8'>
        {/* App Info */}
        <div>
          <div className='flex items-center gap-4 mb-6'>
            <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg'>
              <span className='text-white text-xl'>⚛️</span>
            </div>
            <div className='text-xl font-bold text-white'>Quantum Job Tracker</div>
          </div>
          <p className='text-white/70 mb-4'>Your quantum-inspired companion for tracking job applications and exploring career opportunities in quantum computing.</p>
          <div className='flex gap-4'>
            <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform'>
              <span className='text-white'>📱</span>
            </div>
            <div className='w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform'>
              <span className='text-white'>💼</span>
            </div>
            <div className='w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform'>
              <span className='text-white'>🔍</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className='text-xl font-bold text-white mb-6'>Quick Links</h3>
          <ul className='space-y-3'>
            <li><Link to="/" className='text-white/70 hover:text-white transition-colors'>Home</Link></li>
            <li><Link to="/jobs" className='text-white/70 hover:text-white transition-colors'>Job Board</Link></li>
            <li><Link to="/news" className='text-white/70 hover:text-white transition-colors'>Quantum News</Link></li>
            <li><Link to="/courses" className='text-white/70 hover:text-white transition-colors'>Courses</Link></li>
            <li><Link to="/profile" className='text-white/70 hover:text-white transition-colors'>My Profile</Link></li>
          </ul>
        </div>

        {/* App Features */}
        <div>
          <h3 className='text-xl font-bold text-white mb-6'>App Features</h3>
          <ul className='space-y-3'>
            <li><Link to="/jobs" className='text-white/70 hover:text-white transition-colors'>Application Tracker</Link></li>
            <li><Link to="/news" className='text-white/70 hover:text-white transition-colors'>RSS Feed</Link></li>
            <li><Link to="/reminders" className='text-white/70 hover:text-white transition-colors'>Smart Reminders</Link></li>
            <li><Link to="/analytics" className='text-white/70 hover:text-white transition-colors'>Job Analytics</Link></li>
            <li><Link to="/resources" className='text-white/70 hover:text-white transition-colors'>Career Resources</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className='text-xl font-bold text-white mb-6'>Contact Us</h3>
          <div className='space-y-3 text-white/70'>
            <div className='flex items-center gap-3'>
              <span>📍</span>
              <span>Dravidian University, Kuppam, India</span>
            </div>
            <div className='flex items-center gap-3'>
              <span>📞</span>
              <a href="tel:+919908900112" className="hover:text-white transition-colors">+91 9908900112</a>
            </div>
            <div className='flex items-center gap-3'>
              <span>✉️</span>
              <a href="mailto:reddyprasad2827@gmail.com" className="hover:text-white transition-colors">reddyprasad2827@gmail.com</a>
            </div>
            <div className='flex items-center gap-3'>
              <span>🌐</span>
              <a href="https://www.dravidianuniversity.ac.in" target="_blank" rel="noopener noreferrer" className='hover:text-white transition-colors'>www.dravidianuniversity.ac.in</a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className='border-t border-white/20 mt-12 pt-8 text-center'>
        <p className='text-white/70'>
          © 2024 Quantum Job Tracker. All rights reserved. | 
          <Link to="/privacy" className='hover:text-white transition-colors ml-2'>Privacy Policy</Link> | 
          <Link to="/terms" className='hover:text-white transition-colors ml-2'>Terms of Service</Link>
        </p>
      </div>
    </div>
  </footer>
  )
}

export default FooterPage
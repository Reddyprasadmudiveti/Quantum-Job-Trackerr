import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import UserProfile from '../components/UserProfile'

const Navbar = () => {
    const { isAuthenticated, isAdmin, loading } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const moreMenuRef = useRef(null);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const toggleMoreMenu = () => {
        setIsMoreMenuOpen(!isMoreMenuOpen);
    };

    const closeMoreMenu = () => {
        setIsMoreMenuOpen(false);
    };

    // Close more menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
                closeMoreMenu();
            }
        };

        if (isMoreMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isMoreMenuOpen]);

    // Close more menu on escape key
    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                closeMoreMenu();
            }
        };

        if (isMoreMenuOpen) {
            document.addEventListener('keydown', handleEscapeKey);
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isMoreMenuOpen]);

    return (
        <div className='fixed top-0 mx-20 left-0 right-0 z-50'>
            {/* Background Effects - Responsive */}
            <div className='absolute inset-0'>
                <div className='absolute top-9 left-4 sm:top-10 sm:left-10 lg:top-20 lg:left-20 w-32 h-32 sm:w-48 sm:h-48 lg:w-72 lg:h-72 bg-blue-500/20 rounded-full blur-xl animate-pulse'></div>
                <div className='absolute bottom-4 right-4 sm:bottom-10 sm:right-10 lg:bottom-20 lg:right-20 w-40 h-40 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000'></div>
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-pink-500/20 rounded-full blur-xl animate-pulse delay-500'></div>
            </div>
            
            <nav className='relative z-10 flex justify-between items-center p-3 sm:p-4 lg:p-6 bg-white/10 backdrop-blur-lg border border-white/20 m-2 sm:m-4 lg:m-6 rounded-2xl sm:rounded-3xl shadow-2xl'>
                {/* Logo and Brand - Responsive */}
                <div className='flex items-center gap-2 sm:gap-4'>
                    <div className='relative'>
                        <img
                            src="https://upload.wikimedia.org/wikipedia/en/e/ea/Dravidian_University_logo.png"
                            cache="force-cache"
                            height={40}
                            width={40}
                            alt="University Logo"
                            className='sm:h-[50px] sm:w-[50px] lg:h-[60px] lg:w-[60px] rounded-full shadow-lg transform hover:scale-110 transition-transform duration-300'
                        />
                        <div className='absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 animate-ping'></div>
                    </div>
                    <div className='relative group'>
                        <span className='text-sm sm:text-lg lg:text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text animate-gradient-x'>
                            <span className='hidden sm:inline'>QUANTUM TRACK</span>
                            <span className='sm:hidden'>QT</span>
                        </span>
                        <span className='text-xs sm:text-sm lg:text-xl ml-1 sm:ml-2 border border-gray-400 px-1 sm:px-2 text-gray-400 font-bold rounded'>Beta</span>
                        <style>{`
                            @keyframes gradient-x {
                                0% { background-position: 0% 50%; }
                                50% { background-position: 100% 50%; }
                                100% { background-position: 0% 50%; }
                            }
                            .animate-gradient-x {
                                animation: gradient-x 3s ease infinite;
                                background-size: 200% auto;
                            }
                        `}</style>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <div className='hidden lg:flex gap-4 xl:gap-6 items-center'>
                    <NavLink to="/" icon="🏠" text="Home" />
                    <NavLink to="/jobs" icon="💼" text="Jobs" />
                    
                    {/* More Options Dropdown */}
                    <div className="relative" ref={moreMenuRef}>
                        <button
                            onClick={toggleMoreMenu}
        className="group relative overflow-hidden px-3 py-2 lg:px-5 lg:py-2.5 rounded-lg lg:rounded-xl bg-white/10 hover:bg-white/20 transition-colors duration-300 text-sm lg:text-base"
                            aria-expanded={isMoreMenuOpen}
                            aria-haspopup="true"
    >
        <span className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        <span className="relative flex items-center gap-1 lg:gap-2">
                                <span className="text-base lg:text-lg group-hover:scale-125 transition-transform duration-300">⋯</span>
                                <span className="font-medium text-white group-hover:text-white/90 hidden xl:inline">More</span>
        </span>
        <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                        </button>
                        
                        {isMoreMenuOpen && (
                            <div className="absolute top-full left-0 mt-2 w-48 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg overflow-hidden z-50 animate-fadeIn">
                                <DropdownNavLink to="/resume-builder" icon="📄" text="Resume Builder" onClick={closeMoreMenu} />
                                <DropdownNavLink to="/courses" icon="📚" text="Courses" onClick={closeMoreMenu} />
                                <DropdownNavLink to="/news" icon="📰" text="News" onClick={closeMoreMenu} />
                                {isAuthenticated && isAdmin && (
                                    <>
                                        <div className="border-t border-white/20 my-2"></div>
                                        <DropdownNavLink to="/admin/courses" icon="📚" text="Manage Courses" onClick={closeMoreMenu} />
                                        <DropdownNavLink to="/admin/users" icon="👥" text="Manage Users" onClick={closeMoreMenu} />
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    
                    {!loading && (
                        isAuthenticated ? (
                            <UserProfile />
                        ) : (
                            <Link 
                                to="/signin"
                                className="relative overflow-hidden text-white font-semibold px-4 py-2 lg:px-6 lg:py-3 rounded-lg lg:rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transform hover:scale-105 transition-all duration-300 shadow-lg group text-sm lg:text-base"
    >
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600/50 to-purple-600/50 blur-lg group-hover:scale-150 transition-transform duration-500"></span>
                                <span className="relative">
                                    <span className="hidden sm:inline">Login/Signup</span>
                                    <span className="sm:hidden">Login</span>
                                </span>
    </Link>
)
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className='lg:hidden flex items-center gap-2'>
                    {!loading && isAuthenticated && (
                        <div className="scale-75">
                            <UserProfile />
                        </div>
                    )}
                    <button
                        onClick={toggleMobileMenu}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-300 touch-target"
                        aria-label="Toggle mobile menu"
                    >
                        <div className="w-6 h-6 flex flex-col justify-center items-center">
                            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
                            <span className={`block w-5 h-0.5 bg-white mt-1 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                            <span className={`block w-5 h-0.5 bg-white mt-1 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
                        </div>
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={toggleMobileMenu}>
                        <div className="absolute top-20 left-2 right-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex flex-col space-y-3">
                                <MobileNavLink to="/" icon="🏠" text="Home" onClick={toggleMobileMenu} />
                                <MobileNavLink to="/jobs" icon="💼" text="Jobs" onClick={toggleMobileMenu} />
                                
                                <div className="border-t border-white/20 pt-3 mt-3">
                                    <p className="text-white/60 text-sm font-medium mb-2">More Options</p>
                                    <MobileNavLink to="/resume-builder" icon="📄" text="Resume Builder" onClick={toggleMobileMenu} />
                                    <MobileNavLink to="/courses" icon="📚" text="Courses" onClick={toggleMobileMenu} />
                                    <MobileNavLink to="/news" icon="📰" text="News" onClick={toggleMobileMenu} />
                                </div>
                                
                                {isAuthenticated && isAdmin && (
                                    <>
                                        <div className="border-t border-white/20 pt-3 mt-3">
                                            <p className="text-white/60 text-sm font-medium mb-2">Admin</p>
                                            <MobileNavLink to="/admin/courses" icon="📚" text="Manage Courses" onClick={toggleMobileMenu} />
                                            <MobileNavLink to="/admin/users" icon="👥" text="Manage Users" onClick={toggleMobileMenu} />
                                        </div>
                                    </>
                                )}
                                
                                {!loading && !isAuthenticated && (
                                    <div className="border-t border-white/20 pt-3 mt-3">
                                        <Link 
                                            to="/signin"
                                            onClick={toggleMobileMenu}
                                            className="block w-full text-center text-white font-semibold px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 shadow-lg"
                                        >
                                            Login/Signup
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>
            
            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
}
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
            `}</style>
        </div>
)
}

// Desktop NavLink component
const NavLink = ({ to, icon, text }) => (
    <Link
        to={to}
        className="group relative overflow-hidden px-3 py-2 lg:px-5 lg:py-2.5 rounded-lg lg:rounded-xl bg-white/10 hover:bg-white/20 transition-colors duration-300 text-sm lg:text-base"
    >
        <span className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        <span className="relative flex items-center gap-1 lg:gap-2">
            <span className="text-base lg:text-lg group-hover:scale-125 transition-transform duration-300">{icon}</span>
            <span className="font-medium text-white group-hover:text-white/90 hidden xl:inline">{text}</span>
        </span>
        <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
    </Link>
)

// Dropdown NavLink component for more menu
const DropdownNavLink = ({ to, icon, text, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className="group flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
    >
        <span className="text-lg group-hover:scale-110 transition-transform duration-300">{icon}</span>
        <span className="font-medium text-white group-hover:text-white/90">{text}</span>
    </Link>
)

// Mobile NavLink component
const MobileNavLink = ({ to, icon, text, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/15 transition-colors duration-300 touch-friendly"
    >
        <span className="text-xl group-hover:scale-110 transition-transform duration-300">{icon}</span>
        <span className="font-medium text-white group-hover:text-white/90">{text}</span>
    </Link>
)

export default Navbar
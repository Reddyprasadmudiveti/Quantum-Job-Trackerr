import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import UserProfile from '../components/UserProfile'

const Navbar = () => {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    return (
        <div className='fixed top-0 left-0 right-0 z-50'>
            <div className='absolute inset-0'>
                <div className='absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-xl animate-pulse'></div>
                <div className='absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000'></div>
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-xl animate-pulse delay-500'></div>
            </div>
            <nav className='relative z-10 scale-80 flex justify-between items-center p-4 bg-white/10 backdrop-blur-lg border border-white/20 m-6 rounded-3xl shadow-2xl'>
                <div className='flex items-center gap-4'>
                    <div className='relative'>
                        <img
                            src="https://upload.wikimedia.org/wikipedia/en/e/ea/Dravidian_University_logo.png"
                            cache="force-cache"
                            height={60}
                            width={60}
                            alt="University Logo"
                            className='rounded-full shadow-lg transform hover:scale-110 transition-transform duration-300'
                        />
                        <div className='absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 animate-ping'></div>
                    </div>
                    <div className='text-2xl font-bold relative group'>
                        <span className='absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 transition-opacity duration-1000'></span>
                        <span className='relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text animate-gradient-x'>QUANTUM TRACK</span>
                        <span className='text-xl ml-2 border-2 px-2 text-gray-400 font-bold relative group'>Beta</span>
                        <style jsx>{`
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
                <div className='flex gap-6 items-center'>
                    <NavLink to="/" icon="🏠" text="Home" />
                    <NavLink to="/jobs" icon="💼" text="Jobs" />
                    <NavLink to="/courses" icon="📚" text="Courses" />
                    <NavLink to="/news" icon="📰" text="News" />
                    {isAuthenticated && isAdmin && (
                        <div className="relative group">
                            <div className="group-hover:block hidden absolute top-full right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50">
                                <NavLink to="/admin/courses" icon="📚" text="Manage Courses" />
                                <NavLink to="/admin/users" icon="👥" text="Manage Users" />
                            </div>
                            <NavLink to="#" icon="⚙️" text="Admin" />
                        </div>
                    )}
                    
                    {!loading && (
                        isAuthenticated ? (
                            <UserProfile />
                        ) : (
                            <Link 
                                to="/signin"
                                className="relative overflow-hidden text-white font-semibold px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transform hover:scale-105 transition-all duration-300 shadow-lg group"
                            >
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600/50 to-purple-600/50 blur-lg group-hover:scale-150 transition-transform duration-500"></span>
                                <span className="relative">Login/Signup</span>
                            </Link>
                        )
                    )}
                </div>
            </nav>
        </div>
    )
}

// New NavLink component for consistent styling
const NavLink = ({ to, icon, text }) => (
    <Link
        to={to}
        className="group relative overflow-hidden px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors duration-300"
    >
        <span className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        <span className="relative flex items-center gap-2">
            <span className="text-lg group-hover:scale-125 transition-transform duration-300">{icon}</span>
            <span className="font-medium text-white group-hover:text-white/90">{text}</span>
        </span>
        <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
    </Link>
)

export default Navbar
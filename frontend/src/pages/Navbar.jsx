import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import UserProfile from '../components/UserProfile'
import {toast}from"react-hot-toast";

const Navbar = () => {
    const { isAuthenticated, loading } = useAuth();

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
                    <div className='text-2xl font-bold text-white drop-shadow-lg'>Dravidian University</div>
                </div>
                <div className='flex gap-8 items-center'>
                    <Link onClick={()=>toast.success("Home clicked")} className="text-white font-semibold px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 backdrop-blur-sm border border-white/20 hover:from-blue-400/40 hover:to-purple-400/40 transform hover:scale-105 transition-all duration-300 shadow-lg select-none pointer-events-auto" to={"/"}>🏠 Home</Link>
                    <Link className="text-white font-semibold px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 backdrop-blur-sm border border-white/20 hover:from-blue-400/40 hover:to-purple-400/40 transform hover:scale-105 transition-all duration-300 shadow-lg select-none pointer-events-auto" to={"/jobs"}>💼 Jobs</Link>
                    <Link className="text-white font-semibold px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 backdrop-blur-sm border border-white/20 hover:from-blue-400/40 hover:to-purple-400/40 transform hover:scale-105 transition-all duration-300 shadow-lg select-none pointer-events-auto" to={"/courses"}>📚 Courses</Link>

                    {!loading && (
                        isAuthenticated ? (
                            <UserProfile />
                        ) : (
                            <Link to={"/signin"} className="text-white font-semibold px-6 py-3 rounded-full bg-gradient-to-r from-pink-500/30 to-purple-500/30 backdrop-blur-sm border border-white/20 hover:from-pink-400/40 hover:to-purple-400/40 transform hover:scale-105 transition-all duration-300 shadow-lg select-none pointer-events-auto">Login/Signup</Link>
                        )
                    )}
                </div>
            </nav>
        </div>
    )
}
export default Navbar
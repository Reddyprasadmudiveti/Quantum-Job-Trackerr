import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from "axios"

const UserProfile = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!user) return null;

  const isLogout = async () => {
    console.log("Hello")
    try {
      await axios.post('http://localhost:3000/api/auth/logout');
      logout();
      console.log("Log out Sucessfully")
    } catch (error) {
      console.error('Logout error:', error);
      logout(); // Still logout on client side even if server request fails
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-3 text-white font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-green-500/30 to-blue-500/30 backdrop-blur-sm border border-white/20 hover:from-green-400/40 hover:to-blue-400/40 transform hover:scale-105 transition-all duration-300 shadow-lg"
      >
        <img
          src={user.profilePicture || 'https://avatar.iran.liara.run/public/13'}
          alt={`${user.firstName} ${user.lastName}`}
          className="w-8 h-8 rounded-full"
        />
        <span className="hidden md:block">
          {user.firstName} {user.lastName}
        </span>
        <span className="text-xs">▼</span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-74 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl z-50">
          <div className="p-4 border-b hover:bg-white/10 border-white/20 overflow-hidden">
            <div className="flex items-center gap-3">
              <img
                src={user.profilePicture || 'https://avatar.iran.liara.run/public/13'}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="text-white font-semibold">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-white/70 text-sm">{user.email}</div>
              </div>
            </div>
          </div>
          <div className="p-2">
            <button
              onClick={() => {
                setShowDropdown(false);
                // Navigate to profile page
              }}
              className="w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded-xl transition-colors duration-200"
            >
              👤 Profile Settings
            </button>
            <button
              onClick={() => {
                setShowDropdown(false);
                // Navigate to dashboard
              }}
              className="w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded-xl transition-colors duration-200"
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => {
                setShowDropdown(false);
                // Navigate to enrolled courses
              }}
              className="w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded-xl transition-colors duration-200"
            >
              📚 My Courses
            </button>
            <hr className="border-white/20 my-2" />
            <button
              onClick={() => {
                setShowDropdown(false);
                isLogout();
              }}
              className="w-full text-left px-4 py-2 text-red-500  pointer hover:bg-red-500/20 hover:text-red-200 rounded-xl transition-colors duration-200"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
import React from 'react'
import { Link } from 'react-router-dom'
import JobsDataMigration from '../../components/JobsDataMigration'

const AdminDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <Link to="/" className="text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-colors mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span>Back to Home</span>
        </Link>
        
        <h1 className="text-4xl font-bold text-white mb-4">Admin Dashboard</h1>
        <p className="text-white/70">Manage jobs data and system settings</p>
      </div>

      {/* Navigation */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Link to="/jobs" className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 text-center hover:bg-white/15 transition-all duration-300">
          <div className="text-2xl mb-2">💼</div>
          <div className="text-white font-medium">Jobs Page</div>
        </Link>
        
        <Link to="/courses" className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 text-center hover:bg-white/15 transition-all duration-300">
          <div className="text-2xl mb-2">📚</div>
          <div className="text-white font-medium">Courses</div>
        </Link>
        
        <Link to="/news" className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 text-center hover:bg-white/15 transition-all duration-300">
          <div className="text-2xl mb-2">📰</div>
          <div className="text-white font-medium">News</div>
        </Link>
        
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 text-center">
          <div className="text-2xl mb-2">⚙️</div>
          <div className="text-white font-medium">Settings</div>
        </div>
      </div>

      {/* Jobs Data Migration Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Database Migration</h2>
        <JobsDataMigration />
      </div>

      {/* System Status */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6">System Status</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <div className="w-8 h-8 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-white font-medium">Database</div>
            <div className="text-green-300 text-sm">Connected</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
            </div>
            <div className="text-white font-medium">API Server</div>
            <div className="text-blue-300 text-sm">Running</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <div className="w-8 h-8 bg-purple-500 rounded-full"></div>
            </div>
            <div className="text-white font-medium">Frontend</div>
            <div className="text-purple-300 text-sm">Active</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
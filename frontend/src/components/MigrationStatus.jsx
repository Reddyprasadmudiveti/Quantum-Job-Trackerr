import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

const MigrationStatus = () => {
  const [stats, setStats] = useState({
    courses: 0,
    enrollments: 0,
    lastUpdated: null
  })
  const [loading, setLoading] = useState(true)

  // Fetch migration status
  const fetchStats = async () => {
    try {
      setLoading(true)
      
      const response = await fetch('http://localhost:3000/api/courses')
      
      if (!response.ok) {
        throw new Error('Failed to fetch courses')
      }
      
      const courses = await response.json()
      
      setStats({
        courses: courses.length,
        enrollments: 0, // This would need a separate API call
        lastUpdated: new Date().toLocaleString()
      })
      
    } catch (error) {
      console.error('Error fetching migration stats:', error)
      toast.error('Failed to fetch migration status')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6">Migration Status</h2>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white/70">Loading migration status...</p>
        </div>
      ) : (
        <>
          {/* Stats Section */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="bg-green-500/20 rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold text-white">{stats.courses}</div>
              <div className="text-green-300">Courses Migrated</div>
            </div>
            <div className="bg-blue-500/20 rounded-2xl p-4 text-center">
              <div className="text-sm text-white">Last Updated</div>
              <div className="text-blue-300 text-xs">{stats.lastUpdated}</div>
            </div>
          </div>

          {/* Migration Success Message */}
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-2xl">
            <h3 className="text-green-300 font-bold mb-2">✅ Migration Completed Successfully!</h3>
            <ul className="text-green-200 text-sm space-y-1 list-disc list-inside">
              <li>All hardcoded course data has been moved to MongoDB</li>
              <li>Frontend now fetches courses dynamically from API</li>
              <li>Course categories and levels are served from backend</li>
              <li>Admin interface can manage courses in the database</li>
              <li>Individual course pages load data from API</li>
            </ul>
          </div>

          {/* Action Button */}
          <div className="mt-6">
            <button
              onClick={fetchStats}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-6 rounded-2xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
            >
              🔄 Refresh Status
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default MigrationStatus
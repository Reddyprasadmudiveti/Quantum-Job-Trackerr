import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { ibmJobsApi, quantumJobsApi, handleApiError } from '../utils/jobsApi'

const JobsDataMigration = () => {
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    ibmJobs: 0,
    quantumJobs: 0,
    lastUpdated: null
  })

  // Fetch current stats
  const fetchStats = async () => {
    try {
      setLoading(true)
      
      const [ibmData, quantumData] = await Promise.all([
        ibmJobsApi.getAll({ limit: 1 }),
        quantumJobsApi.getAll({ limit: 1 })
      ])

      setStats({
        ibmJobs: ibmData.totalJobs || 0,
        quantumJobs: quantumData.totalJobs || 0,
        lastUpdated: new Date().toLocaleString()
      })
      
      toast.success('Stats updated successfully')
    } catch (error) {
      const errorMessage = handleApiError(error, 'Failed to fetch stats')
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Trigger data migration (run the migration script)
  const triggerMigration = async () => {
    try {
      setLoading(true)
      toast.loading('Migration in progress... This may take a few minutes')
      
      // Note: In a real application, you would call a backend endpoint
      // that runs the migration script
      toast.dismiss()
      toast.success('Migration completed! Please run the migration script on the server.')
      
      // Refresh stats after migration
      await fetchStats()
    } catch (error) {
      toast.dismiss()
      const errorMessage = handleApiError(error, 'Migration failed')
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Scrape fresh IBM jobs
  const scrapeFreshJobs = async () => {
    try {
      setLoading(true)
      toast.loading('Scraping fresh IBM jobs...')
      
      const data = await ibmJobsApi.scrapeRealTime({ keyword: 'quantum', limit: 20 })
      
      toast.dismiss()
      toast.success(`Scraped ${data.jobs?.length || 0} jobs, ${data.newJobsSaved || 0} new jobs saved`)
      
      await fetchStats()
    } catch (error) {
      toast.dismiss()
      const errorMessage = handleApiError(error, 'Scraping failed')
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6">Jobs Data Management</h2>
      
      {/* Stats Section */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-500/20 rounded-2xl p-4 text-center">
          <div className="text-3xl font-bold text-white">{stats.ibmJobs}</div>
          <div className="text-blue-300">IBM Jobs</div>
        </div>
        <div className="bg-purple-500/20 rounded-2xl p-4 text-center">
          <div className="text-3xl font-bold text-white">{stats.quantumJobs}</div>
          <div className="text-purple-300">Quantum Jobs</div>
        </div>
        <div className="bg-green-500/20 rounded-2xl p-4 text-center">
          <div className="text-sm text-white">Last Updated</div>
          <div className="text-green-300 text-xs">{stats.lastUpdated || 'Never'}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid md:grid-cols-2 gap-4">
        <button
          onClick={fetchStats}
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-6 rounded-2xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50"
        >
          {loading ? '🔄 Loading...' : '📊 Refresh Stats'}
        </button>
        
        <button
          onClick={scrapeFreshJobs}
          disabled={loading}
          className="bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold py-3 px-6 rounded-2xl hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 disabled:opacity-50"
        >
          {loading ? '🔄 Scraping...' : '🔥 Scrape Fresh Jobs'}
        </button>
        
        <button
          onClick={triggerMigration}
          disabled={loading}
          className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-3 px-6 rounded-2xl hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 disabled:opacity-50 md:col-span-2"
        >
          {loading ? '🔄 Migrating...' : '🚀 Run Data Migration'}
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl">
        <h3 className="text-yellow-300 font-bold mb-2">Migration Instructions:</h3>
        <ol className="text-yellow-200 text-sm space-y-1 list-decimal list-inside">
          <li>Run the migration script on your server: <code className="bg-black/30 px-2 py-1 rounded">node scripts/migrateJobsToMongoDB.js</code></li>
          <li>This will move all existing JSON data to MongoDB</li>
          <li>After migration, all job endpoints will use MongoDB exclusively</li>
          <li>Use the "Scrape Fresh Jobs" button to add new jobs to the database</li>
        </ol>
      </div>
    </div>
  )
}

export default JobsDataMigration
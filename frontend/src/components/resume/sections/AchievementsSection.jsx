import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

const AchievementsSection = ({ data, onChange, errors = {}, warnings = {} }) => {
  // Transform data to array of strings before sending to backend
  const handleChange = (achievements) => {
    // Update local state with sanitized date values
    const sanitizedAchievements = achievements.map(achievement => ({
      ...achievement,
      date: achievement.date || '' // Ensure date is never undefined or null
    }));
    
    setLocalData(sanitizedAchievements);
    
    // Convert achievements objects to strings for backend
    const achievementStrings = sanitizedAchievements.map(achievement => {
      // Ensure we have valid text to send to backend
      if (!achievement || !achievement.text) return '';
      return achievement.text.trim();
    }).filter(text => text.length > 0); // Remove any empty strings
    
    // Send the filtered array to parent component
    onChange(achievementStrings);
  };
  
  // Convert string array to object array for UI if needed
  const [localData, setLocalData] = React.useState([]);
  
  React.useEffect(() => {
    // If data is an array of strings, convert to objects for UI
    if (data && Array.isArray(data)) {
      if (data.length > 0 && typeof data[0] === 'string') {
        const objectData = data.map((text, index) => ({
          id: Date.now() + index,
          text,
          category: 'professional',
          date: '', // Initialize with empty string for date
          isHighlight: false
        }));
        setLocalData(objectData);
      } else if (data.length > 0 && typeof data[0] === 'object') {
        // Ensure all objects have the required properties
        const validatedData = data.map((item, index) => {
          // Ensure date is a valid string or empty string
          let safeDate = '';
          try {
            // If date exists and is valid, use it
            if (item.date) {
              // For ISO date strings, keep only the YYYY-MM part for month input
              if (typeof item.date === 'string' && item.date.includes('T')) {
                safeDate = item.date.split('T')[0];
              } else {
                safeDate = item.date;
              }
            }
          } catch (error) {
            console.error('Error processing date:', error);
          }
          
          return {
            id: item.id || Date.now() + index,
            text: item.text || item.description || '',
            category: item.category || 'professional',
            date: safeDate,
            isHighlight: item.isHighlight || false
          };
        });
        setLocalData(validatedData);
      } else {
        // Empty array or other format
        setLocalData([]);
      }
    } else {
      // Data is null or undefined
      setLocalData([]);
    }
  }, [data]);
  const [newAchievement, setNewAchievement] = useState('')
  const [achievementCategory, setAchievementCategory] = useState('professional')

  const achievementCategories = {
    professional: { label: 'Professional Achievements', icon: '🏆', color: 'blue' },
    academic: { label: 'Academic Achievements', icon: '🎓', color: 'green' },
    personal: { label: 'Personal Projects', icon: '💡', color: 'purple' },
    volunteer: { label: 'Volunteer Work', icon: '❤️', color: 'red' },
    awards: { label: 'Awards & Recognition', icon: '🥇', color: 'yellow' },
    certifications: { label: 'Certifications', icon: '📜', color: 'indigo' }
  }

  const achievementTemplates = {
    professional: [
      'Increased sales by X% over Y period',
      'Led a team of X people to achieve Y goal',
      'Reduced costs by $X through process improvement',
      'Implemented new system that improved efficiency by X%',
      'Managed budget of $X for Y project'
    ],
    academic: [
      'Graduated Magna Cum Laude with X GPA',
      'Published research paper on Y topic',
      'Received Dean\'s List recognition for X semesters',
      'Led student organization with X members',
      'Completed thesis on Y with X grade'
    ],
    personal: [
      'Developed mobile app with X downloads',
      'Created website that serves X users monthly',
      'Built open-source project with X GitHub stars',
      'Designed and launched Y product/service',
      'Completed X-month personal challenge'
    ],
    volunteer: [
      'Volunteered X hours for Y organization',
      'Organized fundraising event that raised $X',
      'Mentored X students/professionals',
      'Led community project serving X people',
      'Coordinated volunteer team of X people'
    ],
    awards: [
      'Employee of the Month/Year for X',
      'Received Y award for excellence in X',
      'Won X competition/contest',
      'Recognized for outstanding performance in Y',
      'Achieved X certification/designation'
    ],
    certifications: [
      'AWS Certified Solutions Architect',
      'Google Analytics Certified',
      'Project Management Professional (PMP)',
      'Certified Public Accountant (CPA)',
      'Microsoft Azure Fundamentals'
    ]
  }

  const addAchievement = (achievementText = null) => {
    const achievementToAdd = achievementText || newAchievement.trim()
    if (achievementToAdd) {
      // Check if achievement meets minimum length requirement
      if (achievementToAdd.length < 20) {
        // Show error toast with specific feedback about how many more characters are needed
        toast?.error?.(`Achievement should be at least 20 characters to be meaningful (${20 - achievementToAdd.length} more needed)`) || 
          console.error('Achievement too short');
        return;
      }
      
      // Format the date as YYYY-MM for month input compatibility
      const currentDate = new Date().toISOString().split('T')[0];
      const formattedDate = currentDate.substring(0, 7); // Get just YYYY-MM part
      
      const achievement = {
        id: Date.now(),
        text: achievementToAdd,
        category: achievementCategory,
        date: formattedDate,
        isHighlight: false
      }
      // Use local state for UI but transform for backend
      const updatedAchievements = [...localData, achievement]
      handleChange(updatedAchievements)
      setNewAchievement('')
    }
  }

  const removeAchievement = (achievementId) => {
    const updatedAchievements = localData.filter(achievement => achievement.id !== achievementId)
    handleChange(updatedAchievements)
  }

  const updateAchievement = (achievementId, field, value) => {
    // For text field, validate minimum length when user is done editing
    if (field === 'text') {
      // Always update the local state for better UX
      const updatedAchievements = localData.map(achievement => 
        achievement.id === achievementId ? { ...achievement, [field]: value } : achievement
      );
      setLocalData(updatedAchievements);
      
      // Only send to parent component if valid length or empty (empty will trigger validation later)
      if (value.trim().length >= 20 || value.trim().length === 0) {
        handleChange(updatedAchievements);
      } else if (value.trim().length > 0 && value.trim().length < 20) {
        // Show toast warning but don't block typing
        toast.dismiss(); // Clear any existing toasts
        toast.error(`Achievement should be at least 20 characters (${20 - value.trim().length} more needed)`, {
          duration: 2000,
          position: 'bottom-center'
        });
      }
      return;
    }
    
    // Handle date field specially to prevent errors
    if (field === 'date') {
      try {
        // Format the date value to ensure it's compatible with month input type
        // For month input, the value should be in YYYY-MM format
        let formattedValue = value || '';
        
        // If it's a full date string, extract just the YYYY-MM part
        if (formattedValue && formattedValue.includes('-') && formattedValue.length > 7) {
          formattedValue = formattedValue.substring(0, 7);
        }
        
        // Always update local state for better UX
        const updatedAchievements = localData.map(achievement => 
          achievement.id === achievementId ? { ...achievement, [field]: formattedValue } : achievement
        );
        setLocalData(updatedAchievements);
        handleChange(updatedAchievements);
        return;
      } catch (error) {
        console.error('Error updating date:', error);
        toast.error('There was an error updating the date');
        return;
      }
    }
    
    // For other fields, update normally
    const updatedAchievements = localData.map(achievement => 
      achievement.id === achievementId ? { ...achievement, [field]: value } : achievement
    );
    handleChange(updatedAchievements);
  }

  const toggleHighlight = (achievementId) => {
    const updatedAchievements = localData.map(achievement => 
      achievement.id === achievementId 
        ? { ...achievement, isHighlight: !achievement.isHighlight }
        : achievement
    )
    handleChange(updatedAchievements)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault()
      addAchievement()
    }
  }

  const getAchievementsByCategory = (category) => {
    return localData.filter(achievement => achievement.category === category)
  }

  const getCategoryColor = (category) => {
    const colors = {
      professional: 'border-blue-500/30 bg-blue-500/10',
      academic: 'border-green-500/30 bg-green-500/10',
      personal: 'border-purple-500/30 bg-purple-500/10',
      volunteer: 'border-red-500/30 bg-red-500/10',
      awards: 'border-yellow-500/30 bg-yellow-500/10',
      certifications: 'border-indigo-500/30 bg-indigo-500/10'
    }
    return colors[category] || 'border-white/30 bg-white/10'
  }

  // Check if there are any achievement-related errors or warnings
  const hasAchievementErrors = Object.keys(errors).some(key => 
    key.startsWith('achievements') || key === 'achievements'
  );
  
  const hasAchievementWarnings = Object.keys(warnings).some(key => 
    key.startsWith('achievements') || key === 'achievements'
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Achievements</h2>
        <p className="text-white/70">Showcase your accomplishments and notable achievements</p>
      </div>

      {/* Error Display */}
      {hasAchievementErrors && (
        <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="flex-1">
              <h3 className="text-red-300 font-medium mb-2">Please fix the following errors:</h3>
              <ul className="text-red-200/80 text-sm space-y-1">
                {Object.entries(errors).map(([key, error]) => {
                  if (key.startsWith('achievements') || key === 'achievements') {
                    return <li key={key}>• {error}</li>;
                  }
                  return null;
                })}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {hasAchievementWarnings && (
        <div className="bg-amber-500/20 backdrop-blur-sm border border-amber-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="flex-1">
              <h3 className="text-amber-300 font-medium mb-2">Suggestions to improve your achievements:</h3>
              <ul className="text-amber-200/80 text-sm space-y-1">
                {Object.entries(warnings).map(([key, warning]) => {
                  if (key.startsWith('achievements') || key === 'achievements') {
                    return <li key={key}>• {warning}</li>;
                  }
                  return null;
                })}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Add New Achievement */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4">Add New Achievement</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-white font-medium mb-2">Category</label>
            <select
              value={achievementCategory}
              onChange={(e) => setAchievementCategory(e.target.value)}
              className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
            >
              {Object.entries(achievementCategories).map(([key, category]) => (
                <option key={key} value={key} className="bg-gray-800">
                  {category.icon} {category.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Achievement Description</label>
            <textarea
              value={newAchievement}
              onChange={(e) => setNewAchievement(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={3}
              className={`w-full px-4 py-3 bg-white/20 backdrop-blur-sm border rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 resize-none ${newAchievement.trim().length > 0 && newAchievement.trim().length < 20 ? 'border-red-500' : 'border-white/30'}`}
              placeholder="Describe your achievement with specific details and quantifiable results..."
            />
            {newAchievement.trim().length > 0 && newAchievement.trim().length < 20 ? (
              <p className="text-red-300 text-xs mt-1">
                Achievement should be at least 20 characters to be meaningful ({20 - newAchievement.trim().length} more needed)
              </p>
            ) : (
              <p className="text-white/60 text-xs mt-1">
                Tip: Use numbers and specific details (e.g., "Increased sales by 25% over 6 months")
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => addAchievement()}
            disabled={!newAchievement.trim()}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Achievement
          </button>
        </div>

        {/* Achievement Templates */}
        <div className="mt-6">
          <h4 className="text-white/80 font-medium mb-3">
            Templates - {achievementCategories[achievementCategory].label}
          </h4>
          <div className="space-y-2">
            {achievementTemplates[achievementCategory]?.map((template, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setNewAchievement(template)}
                className="w-full text-left px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white/80 text-sm hover:bg-white/20 transition-all duration-200"
              >
                {template}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements by Category */}
      <div className="space-y-6">
        {Object.entries(achievementCategories).map(([categoryKey, category]) => {
          const categoryAchievements = getAchievementsByCategory(categoryKey)
          if (categoryAchievements.length === 0) return null

          return (
            <motion.div
              key={categoryKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`backdrop-blur-sm border rounded-2xl p-6 ${getCategoryColor(categoryKey)}`}
            >
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <span className="mr-2 text-xl">{category.icon}</span>
                {category.label} ({categoryAchievements.length})
              </h3>

              <div className="space-y-4">
                <AnimatePresence>
                  {categoryAchievements.map((achievement) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className={`bg-white/10 backdrop-blur-sm border rounded-xl p-4 ${
                        achievement.isHighlight ? 'border-yellow-400/50 bg-yellow-500/10' : 'border-white/20'
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Achievement Text */}
                        <div className="flex flex-col">
                          <div className="flex items-start justify-between">
                            <textarea
                              value={achievement.text}
                              onChange={(e) => updateAchievement(achievement.id, 'text', e.target.value)}
                              className={`flex-1 bg-transparent text-white resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-lg p-2 mr-2 ${achievement.text.trim().length > 0 && achievement.text.trim().length < 20 ? 'border border-red-500' : ''}`}
                              rows={2}
                            />
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() => toggleHighlight(achievement.id)}
                                className={`p-2 rounded-lg transition-colors duration-200 ${
                                  achievement.isHighlight 
                                    ? 'text-yellow-300 bg-yellow-500/20' 
                                    : 'text-white/50 hover:text-yellow-300 hover:bg-yellow-500/20'
                                }`}
                                title="Highlight this achievement"
                              >
                                ⭐
                              </button>
                              <button
                                type="button"
                                onClick={() => removeAchievement(achievement.id)}
                                className="p-2 text-red-300 hover:text-red-200 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                          {achievement.text.trim().length > 0 && achievement.text.trim().length < 20 && (
                            <div className="text-red-400 text-xs mt-1 ml-2">
                              Achievement too short! Add {20 - achievement.text.trim().length} more characters.
                            </div>
                          )}
                        </div>

                        {/* Date */}
                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <label className="block text-white/70 text-sm mb-1">Date (Optional)</label>
                            <input
                              type="month"
                              value={achievement.date || ''}
                              onChange={(e) => updateAchievement(achievement.id, 'date', e.target.value)}
                              onInvalid={(e) => e.preventDefault()}
                              className="px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                              max={new Date().toISOString().split('T')[0].substring(0, 7)}
                            />
                          </div>
                          {achievement.isHighlight && (
                            <div className="flex items-center text-yellow-300 text-sm">
                              <span className="mr-1">⭐</span>
                              <span>Highlighted</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Empty State */}
      {localData.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-white/80 text-xl mb-2">No achievements added yet</h3>
          <p className="text-white/60">
            Add your accomplishments to make your resume stand out!
          </p>
        </div>
      )}

      {/* Help Text */}
      <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-4">
        <div className="flex items-start space-x-3">
          <span className="text-blue-300 text-xl">💡</span>
          <div>
            <h4 className="text-blue-200 font-semibold mb-1">Tips for Achievements</h4>
            <ul className="text-blue-200/80 text-sm space-y-1">
              <li>• Use specific numbers and percentages to quantify your impact</li>
              <li>• Focus on results and outcomes, not just activities</li>
              <li>• Include both professional and personal achievements</li>
              <li>• Highlight your most impressive achievements with the star button</li>
              <li>• Use action verbs like "increased," "reduced," "led," "created"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AchievementsSection
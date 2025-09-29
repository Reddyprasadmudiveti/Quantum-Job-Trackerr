import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SkillsSection = ({ data, onChange, errors }) => {
  const [newSkill, setNewSkill] = useState('')
  const [skillCategory, setSkillCategory] = useState('technical')

  const skillCategories = {
    technical: { label: 'Technical Skills', icon: '💻', color: 'blue' },
    soft: { label: 'Soft Skills', icon: '🤝', color: 'green' },
    language: { label: 'Languages', icon: '🌍', color: 'purple' },
    tools: { label: 'Tools & Software', icon: '🛠️', color: 'orange' },
    other: { label: 'Other Skills', icon: '⭐', color: 'pink' }
  }

  const predefinedSkills = {
    technical: [
      'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'HTML/CSS',
      'SQL', 'MongoDB', 'Git', 'Docker', 'AWS', 'Machine Learning', 'Data Analysis'
    ],
    soft: [
      'Leadership', 'Communication', 'Problem Solving', 'Team Collaboration',
      'Project Management', 'Critical Thinking', 'Adaptability', 'Time Management'
    ],
    language: [
      'English', 'Spanish', 'French', 'German', 'Mandarin', 'Japanese',
      'Portuguese', 'Italian', 'Russian', 'Arabic'
    ],
    tools: [
      'Microsoft Office', 'Adobe Creative Suite', 'Figma', 'Slack', 'Jira',
      'Trello', 'Salesforce', 'Google Analytics', 'Tableau', 'Excel'
    ]
  }

  const addSkill = (skillText = null) => {
    const skillToAdd = skillText || newSkill.trim()
    if (skillToAdd && !data.some(skill => skill.name.toLowerCase() === skillToAdd.toLowerCase())) {
      const skill = {
        id: Date.now(),
        name: skillToAdd,
        category: skillCategory,
        level: 'intermediate'
      }
      onChange([...data, skill])
      setNewSkill('')
    }
  }

  const removeSkill = (skillId) => {
    onChange(data.filter(skill => skill.id !== skillId))
  }

  const updateSkillLevel = (skillId, level) => {
    onChange(data.map(skill => 
      skill.id === skillId ? { ...skill, level } : skill
    ))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill()
    }
  }

  const getSkillsByCategory = (category) => {
    return data.filter(skill => skill.category === category)
  }

  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner': return 'bg-yellow-500'
      case 'intermediate': return 'bg-blue-500'
      case 'advanced': return 'bg-green-500'
      case 'expert': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const getLevelWidth = (level) => {
    switch (level) {
      case 'beginner': return 'w-1/4'
      case 'intermediate': return 'w-2/4'
      case 'advanced': return 'w-3/4'
      case 'expert': return 'w-full'
      default: return 'w-2/4'
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Skills</h2>
        <p className="text-white/70">Add your professional skills and expertise</p>
      </div>

      {/* Error Message */}
      {errors.skills && (
        <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-2xl p-4">
          <p className="text-red-200 text-sm">{errors.skills}</p>
        </div>
      )}

      {/* Add New Skill */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4">Add New Skill</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="md:col-span-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
              placeholder="Enter a skill (e.g., JavaScript, Leadership, Spanish)"
            />
          </div>
          <div>
            <select
              value={skillCategory}
              onChange={(e) => setSkillCategory(e.target.value)}
              className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
            >
              {Object.entries(skillCategories).map(([key, category]) => (
                <option key={key} value={key} className="bg-gray-800">
                  {category.icon} {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={() => addSkill()}
          disabled={!newSkill.trim()}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Skill
        </button>

        {/* Predefined Skills */}
        <div className="mt-6">
          <h4 className="text-white/80 font-medium mb-3">Quick Add - {skillCategories[skillCategory].label}</h4>
          <div className="flex flex-wrap gap-2">
            {predefinedSkills[skillCategory]?.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => addSkill(skill)}
                disabled={data.some(s => s.name.toLowerCase() === skill.toLowerCase())}
                className="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white/80 text-sm hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Skills by Category */}
      <div className="space-y-6">
        {Object.entries(skillCategories).map(([categoryKey, category]) => {
          const categorySkills = getSkillsByCategory(categoryKey)
          if (categorySkills.length === 0) return null

          return (
            <motion.div
              key={categoryKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
            >
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <span className="mr-2 text-xl">{category.icon}</span>
                {category.label} ({categorySkills.length})
              </h3>

              <div className="space-y-3">
                <AnimatePresence>
                  {categorySkills.map((skill) => (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-between bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">{skill.name}</span>
                          <button
                            type="button"
                            onClick={() => removeSkill(skill.id)}
                            className="text-red-300 hover:text-red-200 transition-colors duration-200"
                          >
                            🗑️
                          </button>
                        </div>
                        
                        {/* Skill Level */}
                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-white/70 text-sm capitalize">{skill.level}</span>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-2">
                              <div className={`h-2 rounded-full transition-all duration-300 ${getLevelColor(skill.level)} ${getLevelWidth(skill.level)}`}></div>
                            </div>
                          </div>
                          <select
                            value={skill.level}
                            onChange={(e) => updateSkillLevel(skill.id, e.target.value)}
                            className="px-3 py-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                          >
                            <option value="beginner" className="bg-gray-800">Beginner</option>
                            <option value="intermediate" className="bg-gray-800">Intermediate</option>
                            <option value="advanced" className="bg-gray-800">Advanced</option>
                            <option value="expert" className="bg-gray-800">Expert</option>
                          </select>
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

      {/* Help Text */}
      <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-4">
        <div className="flex items-start space-x-3">
          <span className="text-blue-300 text-xl">💡</span>
          <div>
            <h4 className="text-blue-200 font-semibold mb-1">Tips for Skills</h4>
            <ul className="text-blue-200/80 text-sm space-y-1">
              <li>• Include both technical and soft skills relevant to your target role</li>
              <li>• Be honest about your skill levels - employers may test them</li>
              <li>• Focus on skills that are in demand in your industry</li>
              <li>• Include programming languages, tools, and certifications</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkillsSection
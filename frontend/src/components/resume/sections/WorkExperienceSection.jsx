import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WorkExperienceSection = ({ data, onChange, errors, warnings }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const addExperience = () => {
    const newExperience = {
      id: Date.now(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      isCurrentJob: false,
      description: "",
      location: "",
    };
    onChange([...data, newExperience]);
    setExpandedIndex(data.length);
  };

  const removeExperience = (index) => {
    const newData = data.filter((_, i) => i !== index);
    onChange(newData);
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else if (expandedIndex > index) {
      setExpandedIndex(expandedIndex - 1);
    }
  };

  const updateExperience = (index, field, value) => {
    const newData = [...data];
    newData[index] = {
      ...newData[index],
      [field]: value,
    };

    // If marking as current job, clear end date
    if (field === "isCurrentJob" && value) {
      newData[index].endDate = "";
    }

    onChange(newData);
  };

  const toggleExpanded = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Work Experience</h2>
        <p className="text-white/70">Add your professional experience</p>

        {/* Simple error message for missing work experience */}
        {errors.workExperience && (
          <div className="mt-4 flex items-center justify-center space-x-2 text-red-300 text-sm">
            <span>❌</span>
            <span>{errors.workExperience}</span>
          </div>
        )}
      </div>

      {/* Experience Entries */}
      <div className="space-y-4">
        <AnimatePresence>
          {data.map((experience, index) => (
            <motion.div
              key={experience.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden"
            >
              {/* Header */}
              <div
                className="p-4 cursor-pointer hover:bg-white/10 transition-colors duration-200"
                onClick={() => toggleExpanded(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">
                      {experience.position || "New Position"}
                      {experience.company && ` at ${experience.company}`}
                    </h3>
                    <p className="text-white/60 text-sm">
                      {experience.startDate && (
                        <>
                          {new Date(experience.startDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              year: "numeric",
                            },
                          )}
                          {" - "}
                          {experience.isCurrentJob
                            ? "Present"
                            : experience.endDate
                              ? new Date(experience.endDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    year: "numeric",
                                  },
                                )
                              : "End Date TBD"}
                        </>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeExperience(index);
                      }}
                      className="p-2 text-red-300 hover:text-red-200 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
                    >
                      🗑️
                    </button>
                    <span className="text-white/50">
                      {expandedIndex === index ? "▲" : "▼"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-white/20"
                  >
                    <div className="p-6 space-y-4">
                      {/* Company and Position */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white/90 font-medium mb-2">
                            Company *
                          </label>
                          <input
                            type="text"
                            value={experience.company}
                            onChange={(e) =>
                              updateExperience(index, "company", e.target.value)
                            }
                            className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 transition-all duration-300 ${
                              errors[`experience_${index}`]?.company
                                ? "border-red-500/50 focus:ring-red-400"
                                : warnings[`experience_${index}`]?.company
                                  ? "border-yellow-500/50 focus:ring-yellow-400"
                                  : "focus:ring-purple-400 focus:border-transparent"
                            }`}
                            placeholder="Enter actual company name (e.g., Google, Microsoft)"
                          />
                          {(errors[`experience_${index}`]?.company ||
                            warnings[`experience_${index}`]?.company) && (
                            <div className="mt-2 text-sm">
                              {errors[`experience_${index}`]?.company && (
                                <div className="flex items-start space-x-2 text-red-300">
                                  <span className="text-red-400 text-xs mt-0.5">
                                    ❌
                                  </span>
                                  <span>
                                    {errors[`experience_${index}`].company}
                                  </span>
                                </div>
                              )}
                              {warnings[`experience_${index}`]?.company &&
                                !errors[`experience_${index}`]?.company && (
                                  <div className="flex items-start space-x-2 text-yellow-300">
                                    <span className="text-yellow-400 text-xs mt-0.5">
                                      ⚠️
                                    </span>
                                    <span>
                                      {warnings[`experience_${index}`].company}
                                    </span>
                                  </div>
                                )}
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-white/90 font-medium mb-2">
                            Position *
                          </label>
                          <input
                            type="text"
                            value={experience.position}
                            onChange={(e) =>
                              updateExperience(
                                index,
                                "position",
                                e.target.value,
                              )
                            }
                            className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 transition-all duration-300 ${
                              errors[`experience_${index}`]?.position
                                ? "border-red-500/50 focus:ring-red-400"
                                : warnings[`experience_${index}`]?.position
                                  ? "border-yellow-500/50 focus:ring-yellow-400"
                                  : "focus:ring-purple-400 focus:border-transparent"
                            }`}
                            placeholder="Your job title (e.g., Senior Software Engineer)"
                          />
                          {(errors[`experience_${index}`]?.position ||
                            warnings[`experience_${index}`]?.position) && (
                            <div className="mt-2 text-sm">
                              {errors[`experience_${index}`]?.position && (
                                <div className="flex items-start space-x-2 text-red-300">
                                  <span className="text-red-400 text-xs mt-0.5">
                                    ❌
                                  </span>
                                  <span>
                                    {errors[`experience_${index}`].position}
                                  </span>
                                </div>
                              )}
                              {warnings[`experience_${index}`]?.position &&
                                !errors[`experience_${index}`]?.position && (
                                  <div className="flex items-start space-x-2 text-yellow-300">
                                    <span className="text-yellow-400 text-xs mt-0.5">
                                      ⚠️
                                    </span>
                                    <span>
                                      {warnings[`experience_${index}`].position}
                                    </span>
                                  </div>
                                )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Location */}
                      <div>
                        <label className="block text-white/90 font-medium mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          value={experience.location}
                          onChange={(e) =>
                            updateExperience(index, "location", e.target.value)
                          }
                          className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 transition-all duration-300 ${
                            errors[`experience_${index}`]?.location
                              ? "border-red-500/50 focus:ring-red-400"
                              : warnings[`experience_${index}`]?.location
                                ? "border-yellow-500/50 focus:ring-yellow-400"
                                : "focus:ring-purple-400 focus:border-transparent"
                          }`}
                          placeholder="City, State/Province, Country"
                        />
                        {(errors[`experience_${index}`]?.location ||
                          warnings[`experience_${index}`]?.location) && (
                          <div className="mt-2 text-sm">
                            {errors[`experience_${index}`]?.location && (
                              <div className="flex items-start space-x-2 text-red-300">
                                <span className="text-red-400 text-xs mt-0.5">
                                  ❌
                                </span>
                                <span>
                                  {errors[`experience_${index}`].location}
                                </span>
                              </div>
                            )}
                            {warnings[`experience_${index}`]?.location &&
                              !errors[`experience_${index}`]?.location && (
                                <div className="flex items-start space-x-2 text-yellow-300">
                                  <span className="text-yellow-400 text-xs mt-0.5">
                                    ⚠️
                                  </span>
                                  <span>
                                    {warnings[`experience_${index}`].location}
                                  </span>
                                </div>
                              )}
                          </div>
                        )}
                      </div>

                      {/* Dates */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white font-semibold mb-2">
                            Start Date *
                          </label>
                          <input
                            type="month"
                            value={experience.startDate}
                            onChange={(e) =>
                              updateExperience(
                                index,
                                "startDate",
                                e.target.value,
                              )
                            }
                            className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                          />
                        </div>
                        <div>
                          <label className="block text-white font-semibold mb-2">
                            End Date
                          </label>
                          <div className="space-y-2">
                            <input
                              type="month"
                              value={experience.endDate}
                              onChange={(e) =>
                                updateExperience(
                                  index,
                                  "endDate",
                                  e.target.value,
                                )
                              }
                              disabled={experience.isCurrentJob}
                              className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id={`currentJob_${index}`}
                                checked={experience.isCurrentJob}
                                onChange={(e) =>
                                  updateExperience(
                                    index,
                                    "isCurrentJob",
                                    e.target.checked,
                                  )
                                }
                                className="w-4 h-4 rounded border-white/30 bg-white/20 text-purple-600 focus:ring-purple-500"
                              />
                              <label
                                htmlFor={`currentJob_${index}`}
                                className="ml-2 text-sm text-white/80"
                              >
                                I currently work here
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-white/90 font-medium mb-2">
                          Job Description *
                        </label>
                        <textarea
                          value={experience.description}
                          onChange={(e) =>
                            updateExperience(
                              index,
                              "description",
                              e.target.value,
                            )
                          }
                          rows={4}
                          className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 transition-all duration-300 resize-none ${
                            errors[`experience_${index}`]?.description
                              ? "border-red-500/50 focus:ring-red-400"
                              : warnings[`experience_${index}`]?.description
                                ? "border-yellow-500/50 focus:ring-yellow-400"
                                : "focus:ring-purple-400 focus:border-transparent"
                          }`}
                          placeholder="Describe your key achievements with specific results (e.g., 'Increased team productivity by 40%, led 3 junior developers')"
                        />
                        {(errors[`experience_${index}`]?.description ||
                          warnings[`experience_${index}`]?.description) && (
                          <div className="mt-2 text-sm">
                            {errors[`experience_${index}`]?.description && (
                              <div className="flex items-start space-x-2 text-red-300">
                                <span className="text-red-400 text-xs mt-0.5">
                                  ❌
                                </span>
                                <span>
                                  {errors[`experience_${index}`].description}
                                </span>
                              </div>
                            )}
                            {warnings[`experience_${index}`]?.description &&
                              !errors[`experience_${index}`]?.description && (
                                <div className="flex items-start space-x-2 text-yellow-300">
                                  <span className="text-yellow-400 text-xs mt-0.5">
                                    ⚠️
                                  </span>
                                  <span>
                                    {
                                      warnings[`experience_${index}`]
                                        .description
                                    }
                                  </span>
                                </div>
                              )}
                          </div>
                        )}
                        <p className="text-white/60 text-xs mt-1">
                          Tip: Use bullet points and quantify your achievements
                          when possible
                        </p>
                      </div>

                      {/* Error for this specific experience */}
                      {errors[`workExperience_${index}`] && (
                        <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-xl p-3">
                          <p className="text-red-200 text-sm">
                            {errors[`workExperience_${index}`]}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Experience Button */}
      <motion.button
        type="button"
        onClick={addExperience}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm border border-white/30 rounded-2xl text-white font-semibold hover:from-green-500/30 hover:to-blue-500/30 transition-all duration-300 flex items-center justify-center space-x-2"
      >
        <span className="text-xl">➕</span>
        <span>Add Work Experience</span>
      </motion.button>

      {/* Help Text */}
      <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-4">
        <div className="flex items-start space-x-3">
          <span className="text-blue-300 text-xl">💡</span>
          <div>
            <h4 className="text-blue-200 font-semibold mb-1">
              Tips for Work Experience
            </h4>
            <ul className="text-blue-200/80 text-sm space-y-1">
              <li>• Start with your most recent position</li>
              <li>
                • Use action verbs and quantify achievements (e.g., "Increased
                sales by 25%")
              </li>
              <li>• Focus on accomplishments rather than just job duties</li>
              <li>• Keep descriptions concise but impactful</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkExperienceSection;

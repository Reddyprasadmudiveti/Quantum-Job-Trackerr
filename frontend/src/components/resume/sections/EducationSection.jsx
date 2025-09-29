import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EducationSection = ({ data, onChange, errors }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const addEducation = () => {
    const newEducation = {
      id: Date.now(),
      institution: "",
      degree: "",
      field: "",
      graduationDate: "",
      gpa: "",
      location: "",
      achievements: "",
      isCurrentlyStudying: false,
    };
    onChange([...data, newEducation]);
    setExpandedIndex(data.length);
  };

  const removeEducation = (index) => {
    const newData = data.filter((_, i) => i !== index);
    onChange(newData);
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else if (expandedIndex > index) {
      setExpandedIndex(expandedIndex - 1);
    }
  };

  const updateEducation = (index, field, value) => {
    const newData = [...data];
    newData[index] = {
      ...newData[index],
      [field]: value,
    };

    // If currently studying, clear graduation date
    if (field === "isCurrentlyStudying" && value) {
      newData[index].graduationDate = "";
    }

    onChange(newData);
  };

  const toggleExpanded = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Education</h2>
        <p className="text-white/70">Add your educational background</p>
      </div>

      {/* Error Message */}
      {errors.education && (
        <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-2xl p-4">
          <p className="text-red-200 text-sm">{errors.education}</p>
        </div>
      )}

      {/* Education Entries */}
      <div className="space-y-4">
        <AnimatePresence>
          {data.map((education, index) => (
            <motion.div
              key={education.id}
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
                      {education.degree || "New Degree"}
                      {education.field && ` in ${education.field}`}
                    </h3>
                    <p className="text-white/60 text-sm">
                      {education.institution}
                      {education.graduationDate && (
                        <> • {formatDate(education.graduationDate)}</>
                      )}
                      {education.isCurrentlyStudying && (
                        <> • Currently Studying</>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeEducation(index);
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
                      {/* Institution and Degree */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white font-semibold mb-2">
                            Institution *
                          </label>
                          <input
                            type="text"
                            value={education.institution}
                            onChange={(e) =>
                              updateEducation(
                                index,
                                "institution",
                                e.target.value,
                              )
                            }
                            className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                            placeholder="University/College name"
                          />
                        </div>
                        <div>
                          <label className="block text-white font-semibold mb-2">
                            Degree *
                          </label>
                          <select
                            value={education.degree}
                            onChange={(e) =>
                              updateEducation(index, "degree", e.target.value)
                            }
                            className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                          >
                            <option value="" className="bg-gray-800">
                              Select degree
                            </option>
                            <option
                              value="High School Diploma"
                              className="bg-gray-800"
                            >
                              High School Diploma
                            </option>
                            <option
                              value="Associate's Degree"
                              className="bg-gray-800"
                            >
                              Associate's Degree
                            </option>
                            <option
                              value="Bachelor's Degree"
                              className="bg-gray-800"
                            >
                              Bachelor's Degree
                            </option>
                            <option
                              value="Master's Degree"
                              className="bg-gray-800"
                            >
                              Master's Degree
                            </option>
                            <option
                              value="Doctoral Degree"
                              className="bg-gray-800"
                            >
                              Doctoral Degree (PhD)
                            </option>
                            <option
                              value="Professional Degree"
                              className="bg-gray-800"
                            >
                              Professional Degree
                            </option>
                            <option value="Certificate" className="bg-gray-800">
                              Certificate
                            </option>
                            <option value="Other" className="bg-gray-800">
                              Other
                            </option>
                          </select>
                        </div>
                      </div>

                      {/* Field of Study and Location */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white font-semibold mb-2">
                            Field of Study *
                          </label>
                          <input
                            type="text"
                            value={education.field}
                            onChange={(e) =>
                              updateEducation(index, "field", e.target.value)
                            }
                            className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                            placeholder="e.g., Computer Science, Business Administration"
                          />
                        </div>
                        <div>
                          <label className="block text-white font-semibold mb-2">
                            Location
                          </label>
                          <input
                            type="text"
                            value={education.location}
                            onChange={(e) =>
                              updateEducation(index, "location", e.target.value)
                            }
                            className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                            placeholder="City, State/Country"
                          />
                        </div>
                      </div>

                      {/* Graduation Date and GPA */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white font-semibold mb-2">
                            Graduation Date
                          </label>
                          <div className="space-y-2">
                            <input
                              type="month"
                              value={education.graduationDate}
                              onChange={(e) =>
                                updateEducation(
                                  index,
                                  "graduationDate",
                                  e.target.value,
                                )
                              }
                              disabled={education.isCurrentlyStudying}
                              className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id={`currentlyStudying_${index}`}
                                checked={education.isCurrentlyStudying}
                                onChange={(e) =>
                                  updateEducation(
                                    index,
                                    "isCurrentlyStudying",
                                    e.target.checked,
                                  )
                                }
                                className="w-4 h-4 rounded border-white/30 bg-white/20 text-purple-600 focus:ring-purple-500"
                              />
                              <label
                                htmlFor={`currentlyStudying_${index}`}
                                className="ml-2 text-sm text-white/80"
                              >
                                Currently studying
                              </label>
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-white font-semibold mb-2">
                            GPA (Optional)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="4.0"
                            value={education.gpa}
                            onChange={(e) =>
                              updateEducation(index, "gpa", e.target.value)
                            }
                            className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                            placeholder="3.75"
                          />
                          <p className="text-white/60 text-xs mt-1">
                            Only include if 3.5 or higher
                          </p>
                        </div>
                      </div>

                      {/* Achievements */}
                      <div>
                        <label className="block text-white font-semibold mb-2">
                          Achievements & Activities
                        </label>
                        <textarea
                          value={education.achievements}
                          onChange={(e) =>
                            updateEducation(
                              index,
                              "achievements",
                              e.target.value,
                            )
                          }
                          rows={3}
                          className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 resize-none"
                          placeholder="Dean's List, Honor Society, relevant coursework, projects, etc."
                        />
                        <p className="text-white/60 text-xs mt-1">
                          Include honors, awards, relevant coursework, or
                          extracurricular activities
                        </p>
                      </div>

                      {/* Error for this specific education */}
                      {errors[`education_${index}`] && (
                        <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-xl p-3">
                          <div className="text-red-200 text-sm">
                            {typeof errors[`education_${index}`] === "string"
                              ? errors[`education_${index}`]
                              : Object.entries(
                                  errors[`education_${index}`],
                                ).map(([key, value]) => (
                                  <div key={key} className="mb-1">
                                    <strong>
                                      {key.charAt(0).toUpperCase() +
                                        key.slice(1)}
                                      :
                                    </strong>{" "}
                                    {value}
                                  </div>
                                ))}
                          </div>
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

      {/* Add Education Button */}
      <motion.button
        type="button"
        onClick={addEducation}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm border border-white/30 rounded-2xl text-white font-semibold hover:from-green-500/30 hover:to-blue-500/30 transition-all duration-300 flex items-center justify-center space-x-2"
      >
        <span className="text-xl">➕</span>
        <span>Add Education</span>
      </motion.button>

      {/* Help Text */}
      <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-4">
        <div className="flex items-start space-x-3">
          <span className="text-blue-300 text-xl">💡</span>
          <div>
            <h4 className="text-blue-200 font-semibold mb-1">
              Tips for Education
            </h4>
            <ul className="text-blue-200/80 text-sm space-y-1">
              <li>• List your highest degree first</li>
              <li>• Include relevant coursework for recent graduates</li>
              <li>• Only include GPA if it's 3.5 or higher</li>
              <li>• Mention honors, awards, and relevant activities</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationSection;

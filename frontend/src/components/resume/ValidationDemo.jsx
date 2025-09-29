import React, { useState } from "react";
import { motion } from "framer-motion";
import ValidationDisplay from "./ValidationDisplay";
import { ValidatedInput, FieldValidation } from "./ValidationDisplay";
import {
  validatePersonalInfo,
  getValidationSummary,
  VALIDATION_CONSTANTS,
} from "../../utils/resumeValidation";

const ValidationDemo = () => {
  const [demoData, setDemoData] = useState({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      linkedIn: "",
      portfolio: "",
    },
    workExperience: [],
    education: [],
    skills: [],
    achievements: [],
    selectedTemplate: "professional",
  });

  const [validationResult, setValidationResult] = useState(null);

  // Real-time validation
  React.useEffect(() => {
    const result = getValidationSummary(demoData);
    setValidationResult(result);
  }, [demoData]);

  const updatePersonalInfo = (field, value) => {
    setDemoData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  const addSampleData = () => {
    setDemoData({
      personalInfo: {
        fullName: "Jane Smith",
        email: "jane.smith@email.com",
        phone: "+1 (555) 123-4567",
        address: "123 Main Street, New York, NY 10001, USA",
        linkedIn: "https://linkedin.com/in/jane-smith",
        portfolio: "https://janesmith.dev",
      },
      workExperience: [
        {
          id: 1,
          company: "Tech Corp Inc",
          position: "Senior Software Engineer",
          startDate: "2020-01",
          endDate: "2023-12",
          isCurrentJob: false,
          description:
            "Led development of microservices architecture serving 1M+ users. Implemented CI/CD pipelines reducing deployment time by 80%. Mentored 3 junior developers and improved team productivity by 40%.",
          location: "San Francisco, CA",
        },
      ],
      education: [
        {
          id: 1,
          institution: "Stanford University",
          degree: "Master of Science",
          field: "Computer Science",
          graduationDate: "2019-06",
          gpa: "3.8",
        },
      ],
      skills: [
        { id: 1, name: "JavaScript", category: "technical", level: "expert" },
        { id: 2, name: "React", category: "technical", level: "advanced" },
        { id: 3, name: "Node.js", category: "technical", level: "advanced" },
        { id: 4, name: "Python", category: "technical", level: "intermediate" },
        { id: 5, name: "Leadership", category: "soft", level: "advanced" },
        { id: 6, name: "Communication", category: "soft", level: "expert" },
      ],
      achievements: [
        {
          id: 1,
          description:
            "Increased system performance by 60% through database optimization and caching strategies, resulting in $2M annual cost savings.",
        },
        {
          id: 2,
          description:
            "Led cross-functional team of 8 members to deliver critical project 2 weeks ahead of schedule, exceeding client expectations.",
        },
      ],
      selectedTemplate: "professional",
    });
  };

  const addInvalidData = () => {
    setDemoData({
      personalInfo: {
        fullName: "J",
        email: "invalid-email",
        phone: "123",
        address: "test",
        linkedIn: "invalid-url",
        portfolio: "not-a-url",
      },
      workExperience: [
        {
          id: 1,
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          isCurrentJob: false,
          description: "Short desc",
          location: "",
        },
      ],
      education: [],
      skills: [],
      achievements: [],
      selectedTemplate: "",
    });
  };

  const clearData = () => {
    setDemoData({
      personalInfo: {
        fullName: "",
        email: "",
        phone: "",
        address: "",
        linkedIn: "",
        portfolio: "",
      },
      workExperience: [],
      education: [],
      skills: [],
      achievements: [],
      selectedTemplate: "professional",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Resume Validation Demo
          </h1>
          <p className="text-white/80 text-lg">
            Experience the strict validation system in action
          </p>
        </div>

        {/* Demo Controls */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Demo Controls</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={addSampleData}
              className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-200 transition-colors duration-200"
            >
              Load Valid Sample Data
            </button>
            <button
              onClick={addInvalidData}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-200 transition-colors duration-200"
            >
              Load Invalid Data
            </button>
            <button
              onClick={clearData}
              className="px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/30 rounded-lg text-gray-200 transition-colors duration-200"
            >
              Clear All Data
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Demo */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              Try the Validation System
            </h2>

            <div className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Full Name *
                </label>
                <ValidatedInput
                  fieldName="fullName"
                  errors={validationResult?.errors || {}}
                  warnings={validationResult?.warnings || {}}
                >
                  <input
                    type="text"
                    value={demoData.personalInfo.fullName}
                    onChange={(e) =>
                      updatePersonalInfo("fullName", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 transition-all duration-300"
                    placeholder="Enter your full name"
                  />
                </ValidatedInput>
              </div>

              {/* Email */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Email Address *
                </label>
                <ValidatedInput
                  fieldName="email"
                  errors={validationResult?.errors || {}}
                  warnings={validationResult?.warnings || {}}
                >
                  <input
                    type="email"
                    value={demoData.personalInfo.email}
                    onChange={(e) =>
                      updatePersonalInfo("email", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 transition-all duration-300"
                    placeholder="your.email@company.com"
                  />
                </ValidatedInput>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Phone Number *
                </label>
                <ValidatedInput
                  fieldName="phone"
                  errors={validationResult?.errors || {}}
                  warnings={validationResult?.warnings || {}}
                >
                  <input
                    type="tel"
                    value={demoData.personalInfo.phone}
                    onChange={(e) =>
                      updatePersonalInfo("phone", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 transition-all duration-300"
                    placeholder="+1 (555) 123-4567"
                  />
                </ValidatedInput>
              </div>

              {/* LinkedIn */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  LinkedIn Profile
                </label>
                <ValidatedInput
                  fieldName="linkedIn"
                  errors={validationResult?.errors || {}}
                  warnings={validationResult?.warnings || {}}
                >
                  <input
                    type="url"
                    value={demoData.personalInfo.linkedIn}
                    onChange={(e) =>
                      updatePersonalInfo("linkedIn", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 transition-all duration-300"
                    placeholder="https://linkedin.com/in/yourname"
                  />
                </ValidatedInput>
              </div>
            </div>
          </div>

          {/* Validation Results */}
          <div className="space-y-6">
            {/* Real-time Validation Display - Only Completion Score */}
            {validationResult && (
              <ValidationDisplay
                errors={{}}
                warnings={{}}
                completionScore={validationResult.completionScore}
                recommendations={[]}
                showSummary={true}
              />
            )}

            {/* Validation Constants Info */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Validation Rules
              </h3>
              <div className="space-y-3 text-sm text-white/80">
                <div>
                  <strong className="text-white">Full Name:</strong>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>
                      Must be {VALIDATION_CONSTANTS.NAME.MIN_LENGTH}-
                      {VALIDATION_CONSTANTS.NAME.MAX_LENGTH} characters
                    </li>
                    <li>Only letters, spaces, hyphens, apostrophes allowed</li>
                    <li>No placeholder text (test, example, etc.)</li>
                    <li>Must contain at least first and last name</li>
                  </ul>
                </div>

                <div>
                  <strong className="text-white">Email:</strong>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>Must be valid email format</li>
                    <li>
                      Max {VALIDATION_CONSTANTS.EMAIL.MAX_LENGTH} characters
                    </li>
                    <li>No temporary email services</li>
                    <li>Professional domain preferred</li>
                  </ul>
                </div>

                <div>
                  <strong className="text-white">Phone:</strong>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>
                      Must contain {VALIDATION_CONSTANTS.PHONE.MIN_DIGITS}-
                      {VALIDATION_CONSTANTS.PHONE.MAX_DIGITS} digits
                    </li>
                    <li>Valid international format</li>
                    <li>No repeated digits or obvious fake numbers</li>
                  </ul>
                </div>

                <div>
                  <strong className="text-white">LinkedIn:</strong>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>Must be valid LinkedIn URL format</li>
                    <li>Highly recommended for professional resumes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6 text-center"
          >
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-xl font-bold text-white mb-2">
              Strict Validation
            </h3>
            <p className="text-white/70">
              Comprehensive validation rules prevent common resume errors and
              ensure professional quality.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6 text-center"
          >
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-white mb-2">Real-time</h3>
            <p className="text-white/70">
              Instant feedback as you type helps you fix issues immediately
              rather than at submission.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 text-center"
          >
            <div className="text-4xl mb-4">💡</div>
            <h3 className="text-xl font-bold text-white mb-2">Smart Tips</h3>
            <p className="text-white/70">
              Intelligent recommendations help improve your resume quality and
              competitiveness.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ValidationDemo;

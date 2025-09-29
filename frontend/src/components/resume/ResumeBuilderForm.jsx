import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import PersonalInfoSection from "./sections/PersonalInfoSection";
import WorkExperienceSection from "./sections/WorkExperienceSection";
import EducationSection from "./sections/EducationSection";
import SkillsSection from "./sections/SkillsSection";
import AchievementsSection from "./sections/AchievementsSection";
import TemplateSelector from "./TemplateSelector";
import ProgressIndicator from "./ProgressIndicator";
import { CompletionScore } from "./InlineValidation";
import {
  validatePersonalInfo,
  validateWorkExperience,
  validateEducation,
  validateSkills,
  validateAchievements,
  getValidationSummary,
} from "../../utils/resumeValidation";

const ResumeBuilderForm = ({
  onSubmit,
  isLoading = false,
  progressState = null,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
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
  const [errors, setErrors] = useState({});
  const [warnings, setWarnings] = useState({});
  const [touched, setTouched] = useState({});
  const [validationSummary, setValidationSummary] = useState(null);

  const steps = [
    { id: "personal", title: "Personal Information", icon: "👤" },
    { id: "experience", title: "Work Experience", icon: "💼" },
    { id: "education", title: "Education", icon: "🎓" },
    { id: "skills", title: "Skills", icon: "⚡" },
    { id: "achievements", title: "Achievements", icon: "🏆" },
    { id: "template", title: "Choose Template", icon: "🎨" },
  ];

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("resumeBuilderData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
        toast.success("Previous data restored");
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    }
  }, []);

  // Save data to localStorage whenever formData changes
  useEffect(() => {
    localStorage.setItem("resumeBuilderData", JSON.stringify(formData));
  }, [formData]);

  const updateFormData = (section, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  const validateCurrentStep = () => {
    const stepValidations = {
      0: () => validatePersonalInfo(formData.personalInfo),
      1: () => validateWorkExperience(formData.workExperience),
      2: () => validateEducation(formData.education),
      3: () => validateSkills(formData.skills),
      4: () => validateAchievements(formData.achievements),
      5: validateTemplate,
    };

    const validation = stepValidations[currentStep];
    if (validation) {
      const result = validation();
      if (typeof result === "object" && result.errors && result.warnings) {
        setErrors(result.errors);
        setWarnings(result.warnings);
        return Object.keys(result.errors).length === 0;
      } else {
        // For template validation (old format)
        setErrors(result);
        return Object.keys(result).length === 0;
      }
    }
    return true;
  };

  // Comprehensive validation with real-time updates
  useEffect(() => {
    const summary = getValidationSummary(formData);
    setValidationSummary(summary);

    // Update form-level errors and warnings
    setErrors(summary.errors);
    setWarnings(summary.warnings);
  }, [formData]);

  const validateTemplate = () => {
    const errors = {};
    if (!formData.selectedTemplate) {
      errors.template = "Please select a template";
    }
    return errors;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      toast.error("Please fix the errors before continuing");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get comprehensive validation summary
    const summary = getValidationSummary(formData);
    setValidationSummary(summary);

    if (!summary.isValid) {
      toast.error(
        `Please fix ${summary.errorCount} validation error(s) before submitting`,
      );
      // Find the first step with errors and navigate to it
      const stepWithErrors = findFirstStepWithErrors(summary.errors);
      if (stepWithErrors !== -1) {
        setCurrentStep(stepWithErrors);
      }
      return;
    }

    if (summary.completionScore < 70) {
      const proceed = window.confirm(
        `Your resume completeness score is ${summary.completionScore}%. ` +
          "Consider adding more details for a stronger resume. Do you want to proceed anyway?",
      );
      if (!proceed) return;
    }

    // Show success message with score
    toast.success(
      `Resume validated successfully! Completion score: ${summary.completionScore}%`,
      { duration: 4000 },
    );

    onSubmit(formData);
    // Clear saved data after successful submission
    localStorage.removeItem("resumeBuilderData");
  };

  const findFirstStepWithErrors = (errors) => {
    // Map error keys to step indices
    const errorToStep = {
      fullName: 0,
      email: 0,
      phone: 0,
      address: 0,
      linkedIn: 0,
      portfolio: 0,
      workExperience: 1,
      experience_: 1,
      education: 2,
      education_: 2,
      skills: 3,
      skillValidation: 3,
      duplicateSkills: 3,
      achievements: 4,
      achievement_: 4,
      template: 5,
    };

    for (const errorKey of Object.keys(errors)) {
      for (const [pattern, stepIndex] of Object.entries(errorToStep)) {
        if (errorKey.includes(pattern)) {
          return stepIndex;
        }
      }
    }
    return -1;
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PersonalInfoSection
            data={formData.personalInfo}
            onChange={(data) => updateFormData("personalInfo", data)}
            errors={errors}
            warnings={warnings}
            touched={touched}
            setTouched={setTouched}
          />
        );
      case 1:
        return (
          <WorkExperienceSection
            data={formData.workExperience}
            onChange={(data) => updateFormData("workExperience", data)}
            errors={errors}
            warnings={warnings}
          />
        );
      case 2:
        return (
          <EducationSection
            data={formData.education}
            onChange={(data) => updateFormData("education", data)}
            errors={errors}
            warnings={warnings}
          />
        );
      case 3:
        return (
          <SkillsSection
            data={formData.skills}
            onChange={(data) => updateFormData("skills", data)}
            errors={errors}
            warnings={warnings}
          />
        );
      case 4:
        return (
          <AchievementsSection
            data={formData.achievements}
            onChange={(data) => updateFormData("achievements", data)}
            errors={errors}
            warnings={warnings}
          />
        );
      case 5:
        return (
          <TemplateSelector
            selectedTemplate={formData.selectedTemplate}
            onTemplateSelect={(templateId) =>
              updateFormData("selectedTemplate", templateId)
            }
            errors={errors}
            warnings={warnings}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 py-4 sm:py-6 lg:py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header - Responsive */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-4">
            Resume Builder
          </h1>
          <p className="text-white/80 text-sm sm:text-base lg:text-lg">
            Create your professional resume with AI assistance
          </p>
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator
          steps={steps}
          currentStep={currentStep}
          onStepClick={setCurrentStep}
          isProcessing={progressState?.isProcessing}
          processingStep={progressState?.currentStep}
          processingMessage={progressState?.processingMessage}
          error={progressState?.error}
          success={progressState?.success}
          successMessage={
            progressState?.success ? "Resume generated successfully!" : ""
          }
        />

        {/* Completion Score - Only show on final step */}
        {validationSummary && currentStep === steps.length - 1 && (
          <CompletionScore
            score={validationSummary.completionScore}
            className="mt-6 sm:mt-8"
          />
        )}

        {/* Form Container - Responsive */}
        <motion.div
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl mt-6 sm:mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <form onSubmit={handleSubmit}>
            {/* Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderCurrentStep()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons - Responsive */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/20">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="responsive-button bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed touch-target order-2 sm:order-1"
              >
                Previous
              </button>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 order-1 sm:order-2">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem("resumeBuilderData");
                    setFormData({
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
                    setCurrentStep(0);
                    toast.success("Form cleared");
                  }}
                  className="responsive-button bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-200 hover:bg-red-500/30 transition-all duration-300 touch-target"
                >
                  Clear Form
                </button>

                {currentStep === steps.length - 1 ? (
                  <button
                    type="submit"
                    disabled={
                      isLoading ||
                      (validationSummary && !validationSummary.isValid)
                    }
                    className={`responsive-button font-bold shadow-2xl transform transition-all duration-300 touch-target ${
                      validationSummary && !validationSummary.isValid
                        ? "bg-gray-500 cursor-not-allowed opacity-50"
                        : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-blue-500/25 hover:scale-105"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                        <span className="hidden sm:inline">
                          Generating Resume...
                        </span>
                        <span className="sm:hidden">Generating...</span>
                      </div>
                    ) : validationSummary && !validationSummary.isValid ? (
                      <>
                        <span className="hidden sm:inline">
                          Fix Errors First
                        </span>
                        <span className="sm:hidden">Fix Errors</span>
                      </>
                    ) : (
                      <>
                        <span className="hidden sm:inline">
                          Generate Resume
                        </span>
                        <span className="sm:hidden">Generate</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="responsive-button bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 touch-target"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ResumeBuilderForm;

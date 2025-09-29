import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const ValidationDisplay = ({
  errors = {},
  warnings = {},
  completionScore = 0,
  recommendations = [],
  showSummary = false,
  className = "",
}) => {
  const errorCount = Object.keys(errors).length;
  const warningCount = Object.keys(warnings).length;
  const hasIssues = errorCount > 0 || warningCount > 0;

  if (!hasIssues && !showSummary) return null;

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreGradient = (score) => {
    if (score >= 80) return "from-green-500 to-emerald-600";
    if (score >= 60) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  const renderValidationItem = (key, message, type) => (
    <motion.div
      key={key}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className={`flex items-start space-x-3 p-3 rounded-lg ${
        type === "error"
          ? "bg-red-500/10 border border-red-500/20"
          : "bg-yellow-500/10 border border-yellow-500/20"
      }`}
    >
      <div
        className={`flex-shrink-0 text-lg ${
          type === "error" ? "text-red-400" : "text-yellow-400"
        }`}
      >
        {type === "error" ? "❌" : "⚠️"}
      </div>
      <div className="flex-1">
        <p
          className={`text-sm font-medium ${
            type === "error" ? "text-red-200" : "text-yellow-200"
          }`}
        >
          {message}
        </p>
      </div>
    </motion.div>
  );

  const renderFieldError = (fieldKey, fieldErrors) => {
    if (typeof fieldErrors === "string") {
      return renderValidationItem(fieldKey, fieldErrors, "error");
    }

    if (typeof fieldErrors === "object" && !Array.isArray(fieldErrors)) {
      return (
        <div key={fieldKey} className="space-y-2">
          <h4 className="text-red-300 font-medium text-sm capitalize">
            {fieldKey.replace(/_/g, " ")}
          </h4>
          {Object.entries(fieldErrors).map(([subKey, subError]) =>
            renderValidationItem(`${fieldKey}_${subKey}`, subError, "error"),
          )}
        </div>
      );
    }

    if (Array.isArray(fieldErrors)) {
      return (
        <div key={fieldKey} className="space-y-2">
          <h4 className="text-red-300 font-medium text-sm capitalize">
            {fieldKey.replace(/_/g, " ")}
          </h4>
          {fieldErrors.map((error, index) =>
            renderValidationItem(`${fieldKey}_${index}`, error, "error"),
          )}
        </div>
      );
    }

    return null;
  };

  const renderFieldWarning = (fieldKey, fieldWarnings) => {
    if (typeof fieldWarnings === "string") {
      return renderValidationItem(fieldKey, fieldWarnings, "warning");
    }

    if (typeof fieldWarnings === "object" && !Array.isArray(fieldWarnings)) {
      return (
        <div key={fieldKey} className="space-y-2">
          <h4 className="text-yellow-300 font-medium text-sm capitalize">
            {fieldKey.replace(/_/g, " ")}
          </h4>
          {Object.entries(fieldWarnings).map(([subKey, subWarning]) =>
            renderValidationItem(
              `${fieldKey}_${subKey}`,
              subWarning,
              "warning",
            ),
          )}
        </div>
      );
    }

    return null;
  };

  const renderRecommendation = (recommendation, index) => {
    const iconMap = {
      error: "🚨",
      improvement: "📈",
      content: "📝",
      warning: "💡",
    };

    const colorMap = {
      high: "border-red-500/30 bg-red-500/10 text-red-200",
      medium: "border-yellow-500/30 bg-yellow-500/10 text-yellow-200",
      low: "border-blue-500/30 bg-blue-500/10 text-blue-200",
    };

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`p-4 rounded-lg border ${colorMap[recommendation.priority] || colorMap.low}`}
      >
        <div className="flex items-start space-x-3">
          <span className="text-xl">
            {iconMap[recommendation.type] || "💡"}
          </span>
          <div className="flex-1">
            <h4 className="font-semibold mb-1">{recommendation.message}</h4>
            <p className="text-sm opacity-80">{recommendation.action}</p>
          </div>
        </div>
      </motion.div>
    );
  };

  // Only show completion score if showSummary is true
  return showSummary ? (
    <div className={`space-y-6 ${className}`}>
      {/* Completion Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">
            Resume Completeness
          </h3>
          <span
            className={`text-2xl font-bold ${getScoreColor(completionScore)}`}
          >
            {completionScore}%
          </span>
        </div>

        <div className="w-full bg-white/10 rounded-full h-3 mb-4 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionScore}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full bg-gradient-to-r ${getScoreGradient(completionScore)} rounded-full`}
          />
        </div>

        <div className="flex items-center justify-between text-sm text-white/70">
          <span>Keep adding details to improve your score</span>
          <div className="flex items-center space-x-4">
            {errorCount > 0 && (
              <span className="flex items-center space-x-1 text-red-300">
                <span>❌</span>
                <span>
                  {errorCount} error{errorCount !== 1 ? "s" : ""}
                </span>
              </span>
            )}
            {warningCount > 0 && (
              <span className="flex items-center space-x-1 text-yellow-300">
                <span>⚠️</span>
                <span>
                  {warningCount} warning{warningCount !== 1 ? "s" : ""}
                </span>
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Success State */}
      <AnimatePresence>
        {!hasIssues && completionScore >= 80 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-green-500/10 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6 text-center"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-green-200 mb-2">
              Excellent! Your Resume is Ready
            </h3>
            <p className="text-green-300 mb-4">
              Your resume has a high completion score and no validation errors.
              You're ready to generate a professional resume!
            </p>
            <div className="inline-flex items-center space-x-2 bg-green-500/20 px-4 py-2 rounded-lg">
              <span className="text-green-400">✅</span>
              <span className="text-sm text-green-200 font-medium">
                Resume Quality: Excellent ({completionScore}%)
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  ) : null;
};

// Field-specific validation display component
export const FieldValidation = ({
  fieldName,
  errors,
  warnings,
  className = "",
}) => {
  const error = errors[fieldName];
  const warning = warnings[fieldName];

  if (!error && !warning) return null;

  return (
    <div className={`mt-2 space-y-1 ${className}`}>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-start space-x-2 text-sm text-red-300"
          >
            <span className="text-red-400 text-xs mt-0.5">❌</span>
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {warning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-start space-x-2 text-sm text-yellow-300"
          >
            <span className="text-yellow-400 text-xs mt-0.5">⚠️</span>
            <span>{warning}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Input wrapper component with validation styling
export const ValidatedInput = ({
  fieldName,
  errors,
  warnings,
  children,
  className = "",
  showValidation = true,
}) => {
  const hasError = errors[fieldName];
  const hasWarning = warnings[fieldName] && !hasError;

  const borderClass = hasError
    ? "border-red-500/50 focus:ring-red-400"
    : hasWarning
      ? "border-yellow-500/50 focus:ring-yellow-400"
      : "border-white/30 focus:ring-purple-400 focus:border-transparent";

  return (
    <div className={className}>
      {React.cloneElement(children, {
        className: `${children.props.className} ${borderClass}`.trim(),
      })}
      {showValidation && (
        <FieldValidation
          fieldName={fieldName}
          errors={errors}
          warnings={warnings}
        />
      )}
    </div>
  );
};

export default ValidationDisplay;

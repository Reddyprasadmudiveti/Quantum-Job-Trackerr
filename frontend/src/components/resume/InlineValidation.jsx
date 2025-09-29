import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// Simple field validation component that shows only below input fields
export const FieldValidation = ({
  fieldName,
  errors = {},
  warnings = {},
  className = "",
}) => {
  const error = errors[fieldName];
  const warning = warnings[fieldName];

  if (!error && !warning) return null;

  // Helper function to render error/warning content safely
  const renderMessage = (message) => {
    if (typeof message === "string") {
      return message;
    } else if (typeof message === "object" && message !== null) {
      if (Array.isArray(message)) {
        return message.map((item, index) => (
          <div key={index}>
            {typeof item === "string" ? item : JSON.stringify(item)}
          </div>
        ));
      } else {
        // Handle object errors like {institution: "error", degree: "error"}
        return Object.entries(message).map(([key, value]) => (
          <div key={key}>
            <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
            {value}
          </div>
        ));
      }
    } else {
      return String(message);
    }
  };

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
            <span className="text-red-400 text-xs mt-0.5 flex-shrink-0">
              ❌
            </span>
            <div className="leading-tight">{renderMessage(error)}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {warning && !error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-start space-x-2 text-sm text-yellow-300"
          >
            <span className="text-yellow-400 text-xs mt-0.5 flex-shrink-0">
              ⚠️
            </span>
            <div className="leading-tight">{renderMessage(warning)}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Input wrapper component with validation styling
export const ValidatedInput = ({
  fieldName,
  errors = {},
  warnings = {},
  children,
  className = "",
  showValidation = true,
}) => {
  const hasError = errors[fieldName];
  const hasWarning = warnings[fieldName] && !hasError;

  const getBorderClass = () => {
    if (hasError) {
      return "border-red-500/50 focus-within:ring-red-400 focus-within:border-red-500";
    } else if (hasWarning) {
      return "border-yellow-500/50 focus-within:ring-yellow-400 focus-within:border-yellow-500";
    } else {
      return "border-white/30 focus-within:ring-purple-400 focus-within:border-transparent";
    }
  };

  return (
    <div className={className}>
      {React.cloneElement(children, {
        className: `${children.props.className} ${getBorderClass()}`.trim(),
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

// Textarea wrapper with validation
export const ValidatedTextarea = ({
  fieldName,
  errors = {},
  warnings = {},
  children,
  className = "",
  showValidation = true,
}) => {
  const hasError = errors[fieldName];
  const hasWarning = warnings[fieldName] && !hasError;

  const getBorderClass = () => {
    if (hasError) {
      return "border-red-500/50 focus:ring-red-400 focus:border-red-500";
    } else if (hasWarning) {
      return "border-yellow-500/50 focus:ring-yellow-400 focus:border-yellow-500";
    } else {
      return "border-white/30 focus:ring-purple-400 focus:border-transparent";
    }
  };

  return (
    <div className={className}>
      {React.cloneElement(children, {
        className: `${children.props.className} ${getBorderClass()}`.trim(),
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

// Select wrapper with validation
export const ValidatedSelect = ({
  fieldName,
  errors = {},
  warnings = {},
  children,
  className = "",
  showValidation = true,
}) => {
  const hasError = errors[fieldName];
  const hasWarning = warnings[fieldName] && !hasError;

  const getBorderClass = () => {
    if (hasError) {
      return "border-red-500/50 focus:ring-red-400 focus:border-red-500";
    } else if (hasWarning) {
      return "border-yellow-500/50 focus:ring-yellow-400 focus:border-yellow-500";
    } else {
      return "border-white/30 focus:ring-purple-400 focus:border-transparent";
    }
  };

  return (
    <div className={className}>
      {React.cloneElement(children, {
        className: `${children.props.className} ${getBorderClass()}`.trim(),
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

// Validation status indicator for forms
export const ValidationStatus = ({ errors = {}, warnings = {} }) => {
  const errorCount = Object.keys(errors).length;
  const warningCount = Object.keys(warnings).length;

  if (errorCount === 0 && warningCount === 0) {
    return (
      <div className="flex items-center space-x-2 text-green-300 text-sm">
        <span>✅</span>
        <span>All fields are valid</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4 text-sm">
      {errorCount > 0 && (
        <div className="flex items-center space-x-1 text-red-300">
          <span>❌</span>
          <span>
            {errorCount} error{errorCount !== 1 ? "s" : ""}
          </span>
        </div>
      )}
      {warningCount > 0 && (
        <div className="flex items-center space-x-1 text-yellow-300">
          <span>⚠️</span>
          <span>
            {warningCount} suggestion{warningCount !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  );
};

// Completion score indicator (minimal)
export const CompletionScore = ({ score = 0, className = "" }) => {
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

  return (
    <div
      className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">Completion</h3>
        <span className={`text-lg font-bold ${getScoreColor(score)}`}>
          {score}%
        </span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full bg-gradient-to-r ${getScoreGradient(score)} rounded-full`}
        />
      </div>
    </div>
  );
};

export default {
  FieldValidation,
  ValidatedInput,
  ValidatedTextarea,
  ValidatedSelect,
  ValidationStatus,
  CompletionScore,
};

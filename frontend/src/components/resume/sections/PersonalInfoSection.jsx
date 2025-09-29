import React from "react";

import { ValidatedInput } from "../InlineValidation";

const PersonalInfoSection = ({
  data,
  onChange,
  errors,
  warnings,
  setTouched,
}) => {
  const handleInputChange = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          Personal Information
        </h2>
        <p className="text-white/70">Let's start with your basic information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="md:col-span-2">
          <label
            htmlFor="fullName"
            className="block text-white font-semibold mb-2"
          >
            Full Name *
          </label>
          <ValidatedInput
            fieldName="fullName"
            errors={errors}
            warnings={warnings}
          >
            <input
              type="text"
              id="fullName"
              value={data.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              onBlur={() => handleBlur("fullName")}
              className="w-full px-4 py-4 bg-white/20 backdrop-blur-sm border rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 transition-all duration-300"
              placeholder="Enter your full name (e.g., John Michael Smith)"
            />
          </ValidatedInput>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-white font-semibold mb-2"
          >
            Email Address *
          </label>
          <ValidatedInput fieldName="email" errors={errors} warnings={warnings}>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={data.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                className="w-full px-4 py-4 bg-white/20 backdrop-blur-sm border rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 transition-all duration-300"
                placeholder="your.professional.email@company.com"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <span className="text-white/50">📧</span>
              </div>
            </div>
          </ValidatedInput>
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="block text-white font-semibold mb-2"
          >
            Phone Number *
          </label>
          <ValidatedInput fieldName="phone" errors={errors} warnings={warnings}>
            <div className="relative">
              <input
                type="tel"
                id="phone"
                value={data.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                onBlur={() => handleBlur("phone")}
                className="w-full px-4 py-4 bg-white/20 backdrop-blur-sm border rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 transition-all duration-300"
                placeholder="+1 (555) 123-4567"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <span className="text-white/50">📱</span>
              </div>
            </div>
          </ValidatedInput>
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label
            htmlFor="address"
            className="block text-white font-semibold mb-2"
          >
            Address *
          </label>
          <ValidatedInput
            fieldName="address"
            errors={errors}
            warnings={warnings}
          >
            <textarea
              id="address"
              value={data.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              rows={3}
              className="w-full px-4 py-4 bg-white/20 backdrop-blur-sm border rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 transition-all duration-300 resize-none"
              placeholder="123 Main Street, City, State/Province, ZIP/Postal Code, Country"
            />
          </ValidatedInput>
        </div>

        {/* LinkedIn */}
        <div>
          <label
            htmlFor="linkedIn"
            className="block text-white font-semibold mb-2"
          >
            LinkedIn Profile (Highly Recommended)
          </label>
          <ValidatedInput
            fieldName="linkedIn"
            errors={errors}
            warnings={warnings}
          >
            <div className="relative">
              <input
                type="url"
                id="linkedIn"
                value={data.linkedIn}
                onChange={(e) => handleInputChange("linkedIn", e.target.value)}
                className="w-full px-4 py-4 bg-white/20 backdrop-blur-sm border rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 transition-all duration-300"
                placeholder="https://linkedin.com/in/your-professional-name"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <span className="text-white/50">💼</span>
              </div>
            </div>
          </ValidatedInput>
        </div>

        {/* Portfolio */}
        <div>
          <label
            htmlFor="portfolio"
            className="block text-white font-semibold mb-2"
          >
            Portfolio/Website
          </label>
          <ValidatedInput
            fieldName="portfolio"
            errors={errors}
            warnings={warnings}
          >
            <div className="relative">
              <input
                type="url"
                id="portfolio"
                value={data.portfolio}
                onChange={(e) => handleInputChange("portfolio", e.target.value)}
                className="w-full px-4 py-4 bg-white/20 backdrop-blur-sm border rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 transition-all duration-300"
                placeholder="https://your-professional-portfolio.com"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <span className="text-white/50">🌐</span>
              </div>
            </div>
          </ValidatedInput>
        </div>
      </div>

      {/* Enhanced Help Text */}
      <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-4 mt-6">
        <div className="flex items-start space-x-3">
          <span className="text-blue-300 text-xl">💡</span>
          <div>
            <h4 className="text-blue-200 font-semibold mb-2">
              Professional Tips
            </h4>
            <ul className="text-blue-200/80 text-sm space-y-1">
              <li>
                • <strong>Full Name:</strong> Use your complete professional
                name (first + last minimum)
              </li>
              <li>
                • <strong>Email:</strong> Professional format preferred
                (firstname.lastname@domain.com)
              </li>
              <li>
                • <strong>Phone:</strong> Include country code for international
                applications
              </li>
              <li>
                • <strong>Address:</strong> Complete address builds credibility
                and shows location
              </li>
              <li>
                • <strong>LinkedIn:</strong> Essential for networking and
                professional credibility
              </li>
              <li>
                • <strong>Portfolio:</strong> Showcase your work with a
                professional website
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Validation Status */}
      <div className="bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-4 mt-4">
        <div className="flex items-start space-x-3">
          <span className="text-purple-300 text-xl">🔒</span>
          <div>
            <h4 className="text-purple-200 font-semibold mb-1">
              Strict Validation Active
            </h4>
            <p className="text-purple-200/80 text-sm">
              All fields are validated for professional standards. Red
              indicators show errors that must be fixed, while yellow indicators
              show suggestions for improvement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection;

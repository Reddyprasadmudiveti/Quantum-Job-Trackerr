/**
 * Comprehensive Resume Input Validation Utility
 * Provides strict validation rules for all resume form fields
 */

// Validation constants
const VALIDATION_CONSTANTS = {
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
    REGEX: /^[a-zA-Z\s\-'.àáâäçéèêëíìîïñóòôöúùûüýÿæœ]+$/,
    FORBIDDEN_WORDS: [
      "test",
      "example",
      "sample",
      "dummy",
      "fake",
      "null",
      "undefined",
    ],
  },
  EMAIL: {
    MAX_LENGTH: 254,
    REGEX:
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    FORBIDDEN_DOMAINS: [
      "tempmail.org",
      "10minutemail.com",
      "guerrillamail.com",
      "mailinator.com",
    ],
  },
  PHONE: {
    REGEX: /^[+]?[1-9][\d\s\-()]{7,18}$/,
    MIN_DIGITS: 7,
    MAX_DIGITS: 15,
  },
  ADDRESS: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 200,
    REGEX: /^[a-zA-Z0-9\s\-,.#/]+$/,
  },
  URL: {
    REGEX:
      /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
    LINKEDIN_REGEX: /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-_]+\/?$/,
  },
  COMPANY: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
    REGEX: /^[a-zA-Z0-9\s\-.&,()]+$/,
    FORBIDDEN_WORDS: ["company", "test corp", "example inc", "sample ltd"],
  },
  POSITION: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
    REGEX: /^[a-zA-Z0-9\s\-.&,()/]+$/,
    FORBIDDEN_WORDS: ["job title", "position", "role", "test job"],
  },
  DESCRIPTION: {
    MIN_LENGTH: 50,
    MAX_LENGTH: 1000,
    MIN_SENTENCES: 2,
    SENTENCE_REGEX: /[.!?]+/g,
  },
  INSTITUTION: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 150,
    REGEX: /^[a-zA-Z0-9\s\-.&,()]+$/,
    FORBIDDEN_WORDS: [
      "school",
      "university",
      "college",
      "institute",
      "test edu",
    ],
  },
  DEGREE: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
    REGEX: /^[a-zA-Z0-9\s\-.&,()]+$/,
    VALID_DEGREES: [
      "bachelor",
      "master",
      "phd",
      "doctorate",
      "associate",
      "diploma",
      "certificate",
      "bs",
      "ba",
      "ms",
      "ma",
      "mba",
    ],
  },
  FIELD_OF_STUDY: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
    REGEX: /^[a-zA-Z0-9\s\-.&,()]+$/,
  },
  SKILL: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    REGEX: /^[a-zA-Z0-9\s\-.+#/]+$/,
    MIN_SKILLS: 5,
    MAX_SKILLS: 30,
    FORBIDDEN_SKILLS: ["skill", "ability", "knowledge", "test skill"],
  },
  ACHIEVEMENT: {
    MIN_LENGTH: 20,
    MAX_LENGTH: 300,
    MIN_ACHIEVEMENTS: 1,
    MAX_ACHIEVEMENTS: 10,
  },
  DATE: {
    MIN_YEAR: 1950,
    MAX_FUTURE_YEARS: 2,
  },
};

/**
 * Advanced validation utility class
 */
class ResumeValidator {
  constructor() {
    this.errors = {};
    this.warnings = {};
  }

  /**
   * Validate personal information
   */
  validatePersonalInfo(data) {
    const errors = {};
    const warnings = {};

    // Full Name Validation
    if (!data.fullName?.trim()) {
      errors.fullName = "Full name is required";
    } else {
      const name = data.fullName.trim();

      if (name.length < VALIDATION_CONSTANTS.NAME.MIN_LENGTH) {
        errors.fullName = `Name must be at least ${VALIDATION_CONSTANTS.NAME.MIN_LENGTH} characters long`;
      } else if (name.length > VALIDATION_CONSTANTS.NAME.MAX_LENGTH) {
        errors.fullName = `Name must not exceed ${VALIDATION_CONSTANTS.NAME.MAX_LENGTH} characters`;
      } else if (!VALIDATION_CONSTANTS.NAME.REGEX.test(name)) {
        errors.fullName =
          "Name can only contain letters, spaces, hyphens, apostrophes, periods, and accented characters";
      } else if (
        VALIDATION_CONSTANTS.NAME.FORBIDDEN_WORDS.some((word) =>
          name.toLowerCase().includes(word),
        )
      ) {
        errors.fullName = "Please enter your real name, not placeholder text";
      } else if (name.split(" ").length < 2) {
        warnings.fullName =
          "Consider including both first and last name for better professional presentation";
      } else if (name.split(" ").some((part) => part.length < 2)) {
        errors.fullName =
          "Each part of your name should be at least 2 characters long";
      }

      // Check for suspicious patterns
      if (name.match(/^[a-zA-Z]{1,2}(\s[a-zA-Z]{1,2})+$/)) {
        errors.fullName =
          "Name appears to be initials only. Please provide your full name";
      }

      if (name.match(/\d/)) {
        errors.fullName = "Name cannot contain numbers";
      }

      if (name.match(/(.)\1{3,}/)) {
        errors.fullName = "Name contains suspicious repeated characters";
      }
    }

    // Email Validation
    if (!data.email?.trim()) {
      errors.email = "Email address is required";
    } else {
      const email = data.email.trim().toLowerCase();

      if (email.length > VALIDATION_CONSTANTS.EMAIL.MAX_LENGTH) {
        errors.email = "Email address is too long";
      } else if (!VALIDATION_CONSTANTS.EMAIL.REGEX.test(email)) {
        errors.email = "Please enter a valid email address";
      } else {
        const domain = email.split("@")[1];

        if (
          VALIDATION_CONSTANTS.EMAIL.FORBIDDEN_DOMAINS.some((forbiddenDomain) =>
            domain.includes(forbiddenDomain),
          )
        ) {
          errors.email =
            "Please use a permanent email address, not a temporary one";
        }

        if (
          domain.includes("gmail.com") ||
          domain.includes("yahoo.com") ||
          domain.includes("hotmail.com") ||
          domain.includes("outlook.com")
        ) {
          warnings.email =
            "Consider using a professional email address for better impact";
        }

        // Check for suspicious patterns
        if (email.match(/^[a-z]+[0-9]{4,}@/)) {
          warnings.email =
            "Email appears to be auto-generated. Consider using a more professional format";
        }
      }
    }

    // Phone Number Validation
    if (!data.phone?.trim()) {
      errors.phone = "Phone number is required";
    } else {
      const phone = data.phone.trim();
      const digitsOnly = phone.replace(/\D/g, "");

      if (!VALIDATION_CONSTANTS.PHONE.REGEX.test(phone)) {
        errors.phone = "Please enter a valid phone number format";
      } else if (digitsOnly.length < VALIDATION_CONSTANTS.PHONE.MIN_DIGITS) {
        errors.phone = `Phone number must contain at least ${VALIDATION_CONSTANTS.PHONE.MIN_DIGITS} digits`;
      } else if (digitsOnly.length > VALIDATION_CONSTANTS.PHONE.MAX_DIGITS) {
        errors.phone = `Phone number must not exceed ${VALIDATION_CONSTANTS.PHONE.MAX_DIGITS} digits`;
      } else if (digitsOnly.match(/^(.)\1+$/)) {
        errors.phone = "Phone number cannot be all the same digit";
      } else if (digitsOnly.match(/^(123|111|000|999)/)) {
        errors.phone = "Please enter a valid phone number, not a placeholder";
      }
    }

    // Address Validation
    if (!data.address?.trim()) {
      errors.address = "Address is required for professional resumes";
    } else {
      const address = data.address.trim();

      if (address.length < VALIDATION_CONSTANTS.ADDRESS.MIN_LENGTH) {
        errors.address = `Address should be at least ${VALIDATION_CONSTANTS.ADDRESS.MIN_LENGTH} characters for completeness`;
      } else if (address.length > VALIDATION_CONSTANTS.ADDRESS.MAX_LENGTH) {
        errors.address = `Address must not exceed ${VALIDATION_CONSTANTS.ADDRESS.MAX_LENGTH} characters`;
      } else if (!VALIDATION_CONSTANTS.ADDRESS.REGEX.test(address)) {
        errors.address = "Address contains invalid characters";
      } else if (
        address.toLowerCase().includes("address") ||
        address.toLowerCase().includes("street") ||
        address.toLowerCase().includes("example")
      ) {
        errors.address =
          "Please enter your actual address, not placeholder text";
      }
    }

    // LinkedIn Validation
    if (!data.linkedIn?.trim()) {
      warnings.linkedIn =
        "LinkedIn profile is highly recommended for professional networking";
    } else {
      const linkedIn = data.linkedIn.trim();

      if (!VALIDATION_CONSTANTS.URL.LINKEDIN_REGEX.test(linkedIn)) {
        errors.linkedIn =
          "Please enter a valid LinkedIn profile URL (https://linkedin.com/in/yourname)";
      }
    }

    // Portfolio Validation
    if (data.portfolio?.trim()) {
      const portfolio = data.portfolio.trim();

      if (!VALIDATION_CONSTANTS.URL.REGEX.test(portfolio)) {
        errors.portfolio =
          "Please enter a valid portfolio URL (must start with http:// or https://)";
      }
    }

    return { errors, warnings };
  }

  /**
   * Validate work experience
   */
  validateWorkExperience(experiences) {
    const errors = {};
    const warnings = {};

    if (!experiences || experiences.length === 0) {
      errors.workExperience = "At least one work experience entry is required";
      return { errors, warnings };
    }

    if (experiences.length < 2) {
      warnings.workExperience =
        "Consider adding more work experiences to strengthen your resume";
    }

    experiences.forEach((exp, index) => {
      const expErrors = {};
      const expWarnings = {};

      // Company validation
      if (!exp.company?.trim()) {
        expErrors.company = "Company name is required";
      } else {
        const company = exp.company.trim();

        if (company.length < VALIDATION_CONSTANTS.COMPANY.MIN_LENGTH) {
          expErrors.company = "Company name is too short";
        } else if (company.length > VALIDATION_CONSTANTS.COMPANY.MAX_LENGTH) {
          expErrors.company = "Company name is too long";
        } else if (!VALIDATION_CONSTANTS.COMPANY.REGEX.test(company)) {
          expErrors.company = "Company name contains invalid characters";
        } else if (
          VALIDATION_CONSTANTS.COMPANY.FORBIDDEN_WORDS.some((word) =>
            company.toLowerCase().includes(word),
          )
        ) {
          expErrors.company =
            "Please enter the actual company name, not placeholder text";
        }
      }

      // Position validation
      if (!exp.position?.trim()) {
        expErrors.position = "Position title is required";
      } else {
        const position = exp.position.trim();

        if (position.length < VALIDATION_CONSTANTS.POSITION.MIN_LENGTH) {
          expErrors.position = "Position title is too short";
        } else if (position.length > VALIDATION_CONSTANTS.POSITION.MAX_LENGTH) {
          expErrors.position = "Position title is too long";
        } else if (!VALIDATION_CONSTANTS.POSITION.REGEX.test(position)) {
          expErrors.position = "Position title contains invalid characters";
        } else if (
          VALIDATION_CONSTANTS.POSITION.FORBIDDEN_WORDS.some((word) =>
            position.toLowerCase().includes(word),
          )
        ) {
          expErrors.position =
            "Please enter the actual position title, not placeholder text";
        }
      }

      // Date validation
      if (!exp.startDate) {
        expErrors.startDate = "Start date is required";
      } else {
        const startDate = new Date(exp.startDate);
        const currentYear = new Date().getFullYear();

        if (startDate.getFullYear() < VALIDATION_CONSTANTS.DATE.MIN_YEAR) {
          expErrors.startDate = `Start date cannot be before ${VALIDATION_CONSTANTS.DATE.MIN_YEAR}`;
        } else if (
          startDate.getFullYear() >
          currentYear + VALIDATION_CONSTANTS.DATE.MAX_FUTURE_YEARS
        ) {
          expErrors.startDate =
            "Start date cannot be more than 2 years in the future";
        }
      }

      if (!exp.isCurrentJob && !exp.endDate) {
        expErrors.endDate = "End date is required for past positions";
      } else if (exp.endDate && exp.startDate) {
        const startDate = new Date(exp.startDate);
        const endDate = new Date(exp.endDate);

        if (endDate <= startDate) {
          expErrors.endDate = "End date must be after start date";
        }

        // Calculate duration
        const durationMonths =
          (endDate - startDate) / (1000 * 60 * 60 * 24 * 30);
        if (durationMonths < 1) {
          expWarnings.duration =
            "Very short employment duration may raise questions";
        }
      }

      // Description validation
      if (!exp.description?.trim()) {
        expErrors.description = "Job description is required";
      } else {
        const description = exp.description.trim();

        if (description.length < VALIDATION_CONSTANTS.DESCRIPTION.MIN_LENGTH) {
          expErrors.description = `Description should be at least ${VALIDATION_CONSTANTS.DESCRIPTION.MIN_LENGTH} characters to be meaningful`;
        } else if (
          description.length > VALIDATION_CONSTANTS.DESCRIPTION.MAX_LENGTH
        ) {
          expErrors.description = `Description must not exceed ${VALIDATION_CONSTANTS.DESCRIPTION.MAX_LENGTH} characters`;
        }

        const sentences = description
          .split(VALIDATION_CONSTANTS.DESCRIPTION.SENTENCE_REGEX)
          .filter((s) => s.trim());
        if (sentences.length < VALIDATION_CONSTANTS.DESCRIPTION.MIN_SENTENCES) {
          expWarnings.description =
            "Consider adding more detailed bullet points about your achievements";
        }

        // Check for action words
        const actionWords = [
          "achieved",
          "managed",
          "led",
          "developed",
          "created",
          "implemented",
          "improved",
          "increased",
          "reduced",
          "organized",
          "coordinated",
          "supervised",
        ];
        const hasActionWords = actionWords.some((word) =>
          description.toLowerCase().includes(word),
        );
        if (!hasActionWords) {
          expWarnings.description =
            "Consider using more action-oriented language to describe your achievements";
        }
      }

      // Location validation
      if (exp.location && exp.location.trim()) {
        const location = exp.location.trim();
        if (location.length < 2 || location.length > 100) {
          expErrors.location = "Location should be between 2-100 characters";
        }
      } else {
        expWarnings.location = "Adding location can provide valuable context";
      }

      if (Object.keys(expErrors).length > 0) {
        errors[`experience_${index}`] = expErrors;
      }
      if (Object.keys(expWarnings).length > 0) {
        warnings[`experience_${index}`] = expWarnings;
      }
    });

    return { errors, warnings };
  }

  /**
   * Validate education
   */
  validateEducation(educationList) {
    const errors = {};
    const warnings = {};

    if (!educationList || educationList.length === 0) {
      errors.education = "At least one education entry is required";
      return { errors, warnings };
    }

    educationList.forEach((edu, index) => {
      const eduErrors = {};
      const eduWarnings = {};

      // Institution validation
      if (!edu.institution?.trim()) {
        eduErrors.institution = "Institution name is required";
      } else {
        const institution = edu.institution.trim();

        if (institution.length < VALIDATION_CONSTANTS.INSTITUTION.MIN_LENGTH) {
          eduErrors.institution = "Institution name is too short";
        } else if (
          institution.length > VALIDATION_CONSTANTS.INSTITUTION.MAX_LENGTH
        ) {
          eduErrors.institution = "Institution name is too long";
        } else if (!VALIDATION_CONSTANTS.INSTITUTION.REGEX.test(institution)) {
          eduErrors.institution =
            "Institution name contains invalid characters";
        } else if (
          VALIDATION_CONSTANTS.INSTITUTION.FORBIDDEN_WORDS.some((word) =>
            institution.toLowerCase().includes(word),
          )
        ) {
          eduErrors.institution =
            "Please enter the actual institution name, not placeholder text";
        }
      }

      // Degree validation
      if (!edu.degree?.trim()) {
        eduErrors.degree = "Degree is required";
      } else {
        const degree = edu.degree.trim();

        if (degree.length < VALIDATION_CONSTANTS.DEGREE.MIN_LENGTH) {
          eduErrors.degree = "Degree name is too short";
        } else if (degree.length > VALIDATION_CONSTANTS.DEGREE.MAX_LENGTH) {
          eduErrors.degree = "Degree name is too long";
        } else if (!VALIDATION_CONSTANTS.DEGREE.REGEX.test(degree)) {
          eduErrors.degree = "Degree name contains invalid characters";
        }

        // Check if degree is recognized
        const degreeFormatted = degree.toLowerCase().replace(/[^a-z]/g, "");
        const isRecognizedDegree =
          VALIDATION_CONSTANTS.DEGREE.VALID_DEGREES.some((validDegree) =>
            degreeFormatted.includes(validDegree),
          );

        if (!isRecognizedDegree) {
          eduWarnings.degree =
            "Degree type not commonly recognized. Please verify the format";
        }
      }

      // Field of study validation
      if (!edu.field?.trim()) {
        eduErrors.field = "Field of study is required";
      } else {
        const field = edu.field.trim();

        if (field.length < VALIDATION_CONSTANTS.FIELD_OF_STUDY.MIN_LENGTH) {
          eduErrors.field = "Field of study is too short";
        } else if (
          field.length > VALIDATION_CONSTANTS.FIELD_OF_STUDY.MAX_LENGTH
        ) {
          eduErrors.field = "Field of study is too long";
        } else if (!VALIDATION_CONSTANTS.FIELD_OF_STUDY.REGEX.test(field)) {
          eduErrors.field = "Field of study contains invalid characters";
        }
      }

      // Graduation date validation
      if (edu.graduationDate) {
        const gradDate = new Date(edu.graduationDate);
        const currentYear = new Date().getFullYear();

        if (gradDate.getFullYear() < VALIDATION_CONSTANTS.DATE.MIN_YEAR) {
          eduErrors.graduationDate = `Graduation date cannot be before ${VALIDATION_CONSTANTS.DATE.MIN_YEAR}`;
        } else if (
          gradDate.getFullYear() >
          currentYear + VALIDATION_CONSTANTS.DATE.MAX_FUTURE_YEARS
        ) {
          eduErrors.graduationDate =
            "Graduation date cannot be more than 2 years in the future";
        }
      }

      // GPA validation
      if (edu.gpa) {
        const gpa = parseFloat(edu.gpa);
        if (isNaN(gpa) || gpa < 0 || gpa > 4.0) {
          eduErrors.gpa = "GPA must be a number between 0.0 and 4.0";
        } else if (gpa < 3.0) {
          eduWarnings.gpa =
            "Consider omitting GPA below 3.0 unless specifically required";
        }
      }

      if (Object.keys(eduErrors).length > 0) {
        errors[`education_${index}`] = eduErrors;
      }
      if (Object.keys(eduWarnings).length > 0) {
        warnings[`education_${index}`] = eduWarnings;
      }
    });

    return { errors, warnings };
  }

  /**
   * Validate skills
   */
  validateSkills(skills) {
    const errors = {};
    const warnings = {};

    if (!skills || skills.length === 0) {
      errors.skills = "At least 5 skills are required for a competitive resume";
      return { errors, warnings };
    }

    if (skills.length < VALIDATION_CONSTANTS.SKILL.MIN_SKILLS) {
      errors.skills = `Add at least ${VALIDATION_CONSTANTS.SKILL.MIN_SKILLS} skills for a competitive resume`;
    } else if (skills.length > VALIDATION_CONSTANTS.SKILL.MAX_SKILLS) {
      warnings.skills = `Consider reducing to ${VALIDATION_CONSTANTS.SKILL.MAX_SKILLS} most relevant skills for better focus`;
    }

    // Validate individual skills
    const invalidSkills = [];
    const duplicateSkills = [];
    const skillNames = new Set();

    skills.forEach((skill, index) => {
      if (!skill.name?.trim()) {
        invalidSkills.push(`Skill ${index + 1}: Name is required`);
        return;
      }

      const skillName = skill.name.trim().toLowerCase();

      if (skillNames.has(skillName)) {
        duplicateSkills.push(skill.name);
      } else {
        skillNames.add(skillName);
      }

      const name = skill.name.trim();
      if (name.length < VALIDATION_CONSTANTS.SKILL.MIN_LENGTH) {
        invalidSkills.push(`"${name}": Too short`);
      } else if (name.length > VALIDATION_CONSTANTS.SKILL.MAX_LENGTH) {
        invalidSkills.push(`"${name}": Too long`);
      } else if (!VALIDATION_CONSTANTS.SKILL.REGEX.test(name)) {
        invalidSkills.push(`"${name}": Contains invalid characters`);
      } else if (
        VALIDATION_CONSTANTS.SKILL.FORBIDDEN_SKILLS.some((forbidden) =>
          name.toLowerCase().includes(forbidden),
        )
      ) {
        invalidSkills.push(
          `"${name}": Use specific skill names, not generic terms`,
        );
      }

      // Validate skill level
      if (
        !skill.level ||
        !["beginner", "intermediate", "advanced", "expert"].includes(
          skill.level,
        )
      ) {
        invalidSkills.push(`"${name}": Invalid proficiency level`);
      }
    });

    if (invalidSkills.length > 0) {
      errors.skillValidation = invalidSkills;
    }

    if (duplicateSkills.length > 0) {
      errors.duplicateSkills = `Duplicate skills found: ${duplicateSkills.join(", ")}`;
    }

    // Check skill distribution by category
    const categoryCount = skills.reduce((acc, skill) => {
      acc[skill.category] = (acc[skill.category] || 0) + 1;
      return acc;
    }, {});

    if (!categoryCount.technical || categoryCount.technical < 3) {
      warnings.skillDistribution =
        "Consider adding more technical skills to strengthen your profile";
    }

    return { errors, warnings };
  }

  /**
   * Validate achievements
   */
  validateAchievements(achievements) {
    const errors = {};
    const warnings = {};

    if (!achievements || achievements.length === 0) {
      warnings.achievements =
        "Adding achievements can significantly strengthen your resume";
      return { errors, warnings };
    }

    if (
      achievements.length > VALIDATION_CONSTANTS.ACHIEVEMENT.MAX_ACHIEVEMENTS
    ) {
      warnings.achievements = `Consider limiting to ${VALIDATION_CONSTANTS.ACHIEVEMENT.MAX_ACHIEVEMENTS} most impactful achievements`;
    }

    achievements.forEach((achievement, index) => {
      // Check for text property (used in the UI) or description property (used in API)
      const achievementText = achievement.text || achievement.description;
      
      if (!achievementText?.trim()) {
        errors[`achievement_${index}`] = "Achievement description is required";
        return;
      }

      const description = achievementText.trim();

      if (description.length < VALIDATION_CONSTANTS.ACHIEVEMENT.MIN_LENGTH) {
        errors[`achievement_${index}`] =
          `Achievement should be at least ${VALIDATION_CONSTANTS.ACHIEVEMENT.MIN_LENGTH} characters to be meaningful`;
      } else if (
        description.length > VALIDATION_CONSTANTS.ACHIEVEMENT.MAX_LENGTH
      ) {
        errors[`achievement_${index}`] =
          `Achievement must not exceed ${VALIDATION_CONSTANTS.ACHIEVEMENT.MAX_LENGTH} characters`;
      }

      // Check for quantifiable results
      const hasNumbers = /\d/.test(description);
      const hasPercentage = /%/.test(description);
      const hasCurrency = /\$|€|£|₹/.test(description);

      if (!hasNumbers && !hasPercentage && !hasCurrency) {
        warnings[`achievement_${index}`] =
          "Consider adding specific numbers or percentages to quantify your achievement";
      }
    });

    return { errors, warnings };
  }

  /**
   * Comprehensive resume validation
   */
  validateResume(resumeData) {
    const allErrors = {};
    const allWarnings = {};

    // Validate each section
    const personalResult = this.validatePersonalInfo(
      resumeData.personalInfo || {},
    );
    const experienceResult = this.validateWorkExperience(
      resumeData.workExperience || [],
    );
    const educationResult = this.validateEducation(resumeData.education || []);
    const skillsResult = this.validateSkills(resumeData.skills || []);
    const achievementsResult = this.validateAchievements(
      resumeData.achievements || [],
    );

    // Merge all errors and warnings
    Object.assign(allErrors, personalResult.errors);
    Object.assign(allErrors, experienceResult.errors);
    Object.assign(allErrors, educationResult.errors);
    Object.assign(allErrors, skillsResult.errors);
    Object.assign(allErrors, achievementsResult.errors);

    Object.assign(allWarnings, personalResult.warnings);
    Object.assign(allWarnings, experienceResult.warnings);
    Object.assign(allWarnings, educationResult.warnings);
    Object.assign(allWarnings, skillsResult.warnings);
    Object.assign(allWarnings, achievementsResult.warnings);

    // Template validation
    if (!resumeData.selectedTemplate) {
      allErrors.template = "Please select a resume template";
    }

    return {
      errors: allErrors,
      warnings: allWarnings,
      isValid: Object.keys(allErrors).length === 0,
      hasWarnings: Object.keys(allWarnings).length > 0,
    };
  }

  /**
   * Get validation summary
   */
  getValidationSummary(resumeData) {
    const result = this.validateResume(resumeData);

    return {
      ...result,
      errorCount: Object.keys(result.errors).length,
      warningCount: Object.keys(result.warnings).length,
      completionScore: this.calculateCompletionScore(resumeData),
      recommendations: this.getRecommendations(resumeData, result),
    };
  }

  /**
   * Calculate completion score (0-100)
   */
  calculateCompletionScore(resumeData) {
    let score = 0;
    let maxScore = 100;

    // Personal info (30 points)
    const personalInfo = resumeData.personalInfo || {};
    if (personalInfo.fullName?.trim()) score += 8;
    if (personalInfo.email?.trim()) score += 8;
    if (personalInfo.phone?.trim()) score += 6;
    if (personalInfo.address?.trim()) score += 4;
    if (personalInfo.linkedIn?.trim()) score += 2;
    if (personalInfo.portfolio?.trim()) score += 2;

    // Work experience (25 points)
    const experiences = resumeData.workExperience || [];
    if (experiences.length > 0) {
      score += 15;
      if (experiences.length >= 2) score += 5;
      if (experiences.some((exp) => exp.description?.length >= 100)) score += 5;
    }

    // Education (20 points)
    const education = resumeData.education || [];
    if (education.length > 0) {
      score += 15;
      if (education.some((edu) => edu.gpa && edu.gpa >= 3.0)) score += 5;
    }

    // Skills (15 points)
    const skills = resumeData.skills || [];
    if (skills.length >= 5) score += 10;
    if (skills.length >= 10) score += 5;

    // Achievements (10 points)
    const achievements = resumeData.achievements || [];
    if (achievements.length > 0) score += 5;
    if (achievements.length >= 3) score += 5;

    return Math.min(score, maxScore);
  }

  /**
   * Get personalized recommendations
   */
  getRecommendations(resumeData, validationResult) {
    const recommendations = [];

    if (validationResult.errorCount > 0) {
      recommendations.push({
        type: "error",
        priority: "high",
        message: `Fix ${validationResult.errorCount} validation error(s) before submitting`,
        action: "Review and correct highlighted fields",
      });
    }

    const completionScore = this.calculateCompletionScore(resumeData);
    if (completionScore < 70) {
      recommendations.push({
        type: "improvement",
        priority: "medium",
        message: "Your resume completeness score is below 70%",
        action: "Add more details to strengthen your application",
      });
    }

    const experiences = resumeData.workExperience || [];
    if (experiences.length < 2) {
      recommendations.push({
        type: "content",
        priority: "medium",
        message: "Consider adding more work experiences",
        action: "Include internships, part-time jobs, or volunteer work",
      });
    }

    const skills = resumeData.skills || [];
    if (skills.length < 8) {
      recommendations.push({
        type: "content",
        priority: "medium",
        message: "Add more skills to be competitive",
        action: "Include technical skills, tools, and software you know",
      });
    }

    const achievements = resumeData.achievements || [];
    if (achievements.length === 0) {
      recommendations.push({
        type: "content",
        priority: "low",
        message: "Add achievements to make your resume stand out",
        action: "Include awards, certifications, or notable accomplishments",
      });
    }

    if (validationResult.warningCount > 0) {
      recommendations.push({
        type: "warning",
        priority: "low",
        message: `${validationResult.warningCount} suggestion(s) for improvement`,
        action: "Review suggestions to enhance your resume quality",
      });
    }

    return recommendations;
  }

  /**
   * Get field-specific validation message
   */
  getFieldMessage(fieldName, errors, warnings) {
    const error = errors[fieldName];
    const warning = warnings[fieldName];

    if (error) {
      return { type: "error", message: error };
    } else if (warning) {
      return { type: "warning", message: warning };
    }
    return null;
  }

  /**
   * Check if field is valid
   */
  isFieldValid(fieldName, errors) {
    return !errors[fieldName];
  }
}

// Create singleton instance
const resumeValidator = new ResumeValidator();

// Export validation functions
export const validatePersonalInfo = (data) =>
  resumeValidator.validatePersonalInfo(data);
export const validateWorkExperience = (data) =>
  resumeValidator.validateWorkExperience(data);
export const validateEducation = (data) =>
  resumeValidator.validateEducation(data);
export const validateSkills = (data) => resumeValidator.validateSkills(data);
export const validateAchievements = (data) =>
  resumeValidator.validateAchievements(data);
export const validateResume = (data) => resumeValidator.validateResume(data);
export const getValidationSummary = (data) =>
  resumeValidator.getValidationSummary(data);
export const getFieldMessage = (fieldName, errors, warnings) =>
  resumeValidator.getFieldMessage(fieldName, errors, warnings);
export const isFieldValid = (fieldName, errors) =>
  resumeValidator.isFieldValid(fieldName, errors);

// Export constants for use in components
export { VALIDATION_CONSTANTS };

// Export validator instance for advanced usage
export default resumeValidator;

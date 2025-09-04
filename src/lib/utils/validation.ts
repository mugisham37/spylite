// Comprehensive validation utilities with TypeScript support
import type {
  ValidationRule,
  ValidationSchema,
  ValidationResult,
} from "@/types/utils";

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// URL validation regex
const URL_REGEX =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

// Phone number validation regex (international format)
const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/;

// Strong password regex (at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Credit card number regex (basic validation)
const CREDIT_CARD_REGEX = /^\d{13,19}$/;

// Basic validation functions
export const validators = {
  // Required field validation
  required: (value: unknown): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === "string") return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "object") return Object.keys(value).length > 0;
    return Boolean(value);
  },

  // String length validation
  minLength:
    (min: number) =>
    (value: string): boolean => {
      return typeof value === "string" && value.length >= min;
    },

  maxLength:
    (max: number) =>
    (value: string): boolean => {
      return typeof value === "string" && value.length <= max;
    },

  // Number range validation
  min:
    (minimum: number) =>
    (value: number): boolean => {
      return typeof value === "number" && value >= minimum;
    },

  max:
    (maximum: number) =>
    (value: number): boolean => {
      return typeof value === "number" && value <= maximum;
    },

  // Pattern validation
  pattern:
    (regex: RegExp) =>
    (value: string): boolean => {
      return typeof value === "string" && regex.test(value);
    },

  // Email validation
  email: (value: string): boolean => {
    return typeof value === "string" && EMAIL_REGEX.test(value.trim());
  },

  // URL validation
  url: (value: string): boolean => {
    return typeof value === "string" && URL_REGEX.test(value.trim());
  },

  // Phone number validation
  phone: (value: string): boolean => {
    return (
      typeof value === "string" && PHONE_REGEX.test(value.replace(/\s/g, ""))
    );
  },

  // Password strength validation
  strongPassword: (value: string): boolean => {
    return typeof value === "string" && STRONG_PASSWORD_REGEX.test(value);
  },

  // Credit card validation (basic)
  creditCard: (value: string): boolean => {
    return (
      typeof value === "string" &&
      CREDIT_CARD_REGEX.test(value.replace(/\s/g, ""))
    );
  },

  // Date validation
  date: (value: string | Date): boolean => {
    const date = value instanceof Date ? value : new Date(value);
    return !isNaN(date.getTime());
  },

  // Future date validation
  futureDate: (value: string | Date): boolean => {
    const date = value instanceof Date ? value : new Date(value);
    return validators.date(value) && date > new Date();
  },

  // Past date validation
  pastDate: (value: string | Date): boolean => {
    const date = value instanceof Date ? value : new Date(value);
    return validators.date(value) && date < new Date();
  },

  // Age validation (18+)
  minimumAge:
    (minAge: number = 18) =>
    (value: string | Date): boolean => {
      const birthDate = value instanceof Date ? value : new Date(value);
      if (!validators.date(value)) return false;

      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        return age - 1 >= minAge;
      }

      return age >= minAge;
    },

  // Array validation
  arrayMinLength:
    (min: number) =>
    (value: unknown[]): boolean => {
      return Array.isArray(value) && value.length >= min;
    },

  arrayMaxLength:
    (max: number) =>
    (value: unknown[]): boolean => {
      return Array.isArray(value) && value.length <= max;
    },

  // File validation
  fileSize:
    (maxSizeInBytes: number) =>
    (file: File): boolean => {
      return file instanceof File && file.size <= maxSizeInBytes;
    },

  fileType:
    (allowedTypes: string[]) =>
    (file: File): boolean => {
      return file instanceof File && allowedTypes.includes(file.type);
    },

  // Image validation
  imageFile: (file: File): boolean => {
    const imageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    return validators.fileType(imageTypes)(file);
  },

  // Video validation
  videoFile: (file: File): boolean => {
    const videoTypes = ["video/mp4", "video/webm", "video/ogg", "video/avi"];
    return validators.fileType(videoTypes)(file);
  },

  // Custom validation
  custom: <T>(fn: (value: T) => boolean) => fn,
} as const;

// Validation error messages
export const validationMessages = {
  required: "This field is required",
  minLength: (min: number) => `Must be at least ${min} characters long`,
  maxLength: (max: number) => `Must be no more than ${max} characters long`,
  min: (minimum: number) => `Must be at least ${minimum}`,
  max: (maximum: number) => `Must be no more than ${maximum}`,
  pattern: "Invalid format",
  email: "Please enter a valid email address",
  url: "Please enter a valid URL",
  phone: "Please enter a valid phone number",
  strongPassword:
    "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character",
  creditCard: "Please enter a valid credit card number",
  date: "Please enter a valid date",
  futureDate: "Date must be in the future",
  pastDate: "Date must be in the past",
  minimumAge: (age: number) => `Must be at least ${age} years old`,
  arrayMinLength: (min: number) => `Must select at least ${min} items`,
  arrayMaxLength: (max: number) => `Must select no more than ${max} items`,
  fileSize: (maxSize: number) =>
    `File size must be less than ${formatFileSize(maxSize)}`,
  fileType: (types: string[]) => `File must be one of: ${types.join(", ")}`,
  imageFile: "File must be a valid image (JPEG, PNG, GIF, WebP)",
  videoFile: "File must be a valid video (MP4, WebM, OGG, AVI)",
} as const;

// Format file size for display
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Validate a single field
export const validateField = <T>(
  value: T,
  rules: ValidationRule<T>
): { isValid: boolean; error?: string } => {
  // Check required
  if (rules.required && !validators.required(value)) {
    return {
      isValid: false,
      error: rules.message || validationMessages.required,
    };
  }

  // Skip other validations if field is empty and not required
  if (!validators.required(value) && !rules.required) {
    return { isValid: true };
  }

  // Check string length
  if (typeof value === "string") {
    if (rules.minLength && !validators.minLength(rules.minLength)(value)) {
      return {
        isValid: false,
        error: rules.message || validationMessages.minLength(rules.minLength),
      };
    }

    if (rules.maxLength && !validators.maxLength(rules.maxLength)(value)) {
      return {
        isValid: false,
        error: rules.message || validationMessages.maxLength(rules.maxLength),
      };
    }
  }

  // Check number range
  if (typeof value === "number") {
    if (rules.min !== undefined && !validators.min(rules.min)(value)) {
      return {
        isValid: false,
        error: rules.message || validationMessages.min(rules.min),
      };
    }

    if (rules.max !== undefined && !validators.max(rules.max)(value)) {
      return {
        isValid: false,
        error: rules.message || validationMessages.max(rules.max),
      };
    }
  }

  // Check pattern
  if (
    rules.pattern &&
    typeof value === "string" &&
    !validators.pattern(rules.pattern)(value)
  ) {
    return {
      isValid: false,
      error: rules.message || validationMessages.pattern,
    };
  }

  // Check custom validation
  if (rules.custom) {
    const customResult = rules.custom(value);
    if (typeof customResult === "boolean" && !customResult) {
      return { isValid: false, error: rules.message || "Invalid value" };
    }
    if (typeof customResult === "string") {
      return { isValid: false, error: customResult };
    }
  }

  return { isValid: true };
};

// Validate an object against a schema
export const validateSchema = <T extends Record<string, unknown>>(
  data: T,
  schema: ValidationSchema
): ValidationResult => {
  const errors: Record<string, string> = {};
  let isValid = true;

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];
    const result = validateField(value, rules);

    if (!result.isValid && result.error) {
      errors[field] = result.error;
      isValid = false;
    }
  }

  return { isValid, errors };
};

// Async validation support
export const validateFieldAsync = async <T>(
  value: T,
  rules: ValidationRule<T> & {
    asyncValidator?: (value: T) => Promise<boolean | string>;
  }
): Promise<{ isValid: boolean; error?: string }> => {
  // First run synchronous validation
  const syncResult = validateField(value, rules);
  if (!syncResult.isValid) {
    return syncResult;
  }

  // Then run async validation if provided
  if (rules.asyncValidator) {
    try {
      const asyncResult = await rules.asyncValidator(value);
      if (typeof asyncResult === "boolean" && !asyncResult) {
        return { isValid: false, error: rules.message || "Invalid value" };
      }
      if (typeof asyncResult === "string") {
        return { isValid: false, error: asyncResult };
      }
    } catch {
      return { isValid: false, error: "Validation failed" };
    }
  }

  return { isValid: true };
};

// Debounced validation for real-time feedback
export const createDebouncedValidator = <T>(
  validator: (value: T) => Promise<{ isValid: boolean; error?: string }>,
  delay: number = 300
) => {
  let timeoutId: NodeJS.Timeout;

  return (value: T): Promise<{ isValid: boolean; error?: string }> => {
    return new Promise((resolve) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        const result = await validator(value);
        resolve(result);
      }, delay);
    });
  };
};

// Form validation utilities
export const createFormValidator = <T extends Record<string, unknown>>(
  schema: ValidationSchema
) => {
  return {
    validate: (data: T) => validateSchema(data, schema),
    validateField: (field: keyof T, value: unknown) => {
      const rules = schema[field as string];
      return rules ? validateField(value, rules) : { isValid: true };
    },
    getFieldRules: (field: keyof T) => schema[field as string],
    hasField: (field: keyof T) => (field as string) in schema,
  };
};

// Sanitization utilities
export const sanitizers = {
  // Remove HTML tags
  stripHtml: (value: string): string => {
    return value.replace(/<[^>]*>/g, "");
  },

  // Escape HTML entities
  escapeHtml: (value: string): string => {
    const div = document.createElement("div");
    div.textContent = value;
    return div.innerHTML;
  },

  // Trim whitespace
  trim: (value: string): string => {
    return value.trim();
  },

  // Convert to lowercase
  toLowerCase: (value: string): string => {
    return value.toLowerCase();
  },

  // Convert to uppercase
  toUpperCase: (value: string): string => {
    return value.toUpperCase();
  },

  // Remove non-numeric characters
  numbersOnly: (value: string): string => {
    return value.replace(/\D/g, "");
  },

  // Remove non-alphanumeric characters
  alphanumericOnly: (value: string): string => {
    return value.replace(/[^a-zA-Z0-9]/g, "");
  },

  // Format phone number
  formatPhone: (value: string): string => {
    const numbers = sanitizers.numbersOnly(value);
    if (numbers.length === 10) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(
        6
      )}`;
    }
    return value;
  },

  // Format credit card number
  formatCreditCard: (value: string): string => {
    const numbers = sanitizers.numbersOnly(value);
    return numbers.replace(/(.{4})/g, "$1 ").trim();
  },
} as const;

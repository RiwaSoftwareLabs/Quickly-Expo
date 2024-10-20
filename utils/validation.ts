import {
  isPossiblePhoneNumber,
  isValidPhoneNumber,
  CountryCode,
} from "libphonenumber-js";

// validation.ts
export const validateStep1 = (
  email: string,
  mobile: string,
  password: string,
  confirmPassword: string,
  isEmailSignUp: boolean,
  countryCode?: CountryCode | any,
) => {
  const errors: { [key: string]: string } = {};
  if (isEmailSignUp) {
    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!isValidEmail(email)) {
      errors.email = "Please enter a valid email address.";
    }
  } else {
    if (!mobile.trim()) {
      errors.mobile = "Mobile number is required.";
    } else if (!isValidMobile(mobile, countryCode)) {
      errors.mobile = "Please enter a valid mobile number.";
    }
  }
  if (!password.trim()) {
    errors.password = "Password is required.";
  } else if (!isStrongPassword(password)) {
    errors.password =
      "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.";
  }
  if (!confirmPassword.trim()) {
    errors.confirmPassword = "Confirm Password is required.";
  }
  if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }
  return errors;
};

export const validateStep2 = (
  fullName: string,
  email: string,
  mobile: string,
  dob: Date | undefined,
  gender: string,
  nationality: string,
  residence: string,
  city: string,
  isEmailSignUp: boolean,
  countryCode?: CountryCode | any,
) => {
  const errors: { [key: string]: string } = {};
  if (!fullName.trim()) {
    errors.fullName = "Full name is required.";
  } else if (!isValidFullName(fullName)) {
    errors.fullName = "Full name can only contain alphabets.";
  }
  if (isEmailSignUp) {
    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!isValidEmail(email)) {
      errors.email = "Please enter a valid email address.";
    }
  } else {
    if (!mobile.trim()) {
      errors.mobile = "Mobile number is required.";
    } else if (!isValidMobile(mobile, countryCode)) {
      errors.mobile = "Please enter a valid mobile number.";
    }
  }

  if (!dob) {
    errors.dob = "Date of birth is required.";
  } else if (!isValidDateOfBirth(dob)) {
    errors.dob = "You must be between 14 and 150 years old.";
  }
  if (!gender.trim()) {
    errors.gender = "Date of birth is required.";
  }
  if (!nationality.trim()) {
    errors.nationality = "Nationality is required.";
  }
  if (!residence.trim()) {
    errors.residence = "Residence is required.";
  }
  if (!city.trim()) {
    errors.city = "City is required.";
  } else if (!isValidCity(city)) {
    errors.city = "City can only contain alphabets.";
  }
  return errors;
};

interface AdditionalParams {
  password?: string;
  countryCode?: string;
}

interface FormData {
  fullName: string;
  email: string;
  mobile: string;
  countryCode: string;
  gender: string;
  dob: Date;
  nationality: string;
  residence: string;
  city: string;
  password: string;
  confirmPassword: string;
  isPasswordVisible: boolean;
  isConfirmPasswordVisible: boolean;
  subscribeNews: boolean;
  loginEmail: string;
  loginMobile: string;
  loginPassword: string;
  resetEmail: string;
}

export const validateField = (
  key: keyof FormData,
  value: string | boolean | Date | undefined,
  isRequired: boolean,
  additionalParams?: AdditionalParams,
): string | undefined => {
  // Check if the field is required and the value is empty
  if (isRequired && (value === undefined || value === "")) {
    return `${key.charAt(0).toUpperCase() + key.slice(1)} is required.`;
  }

  // If not required and value is empty, skip further validation
  if (!isRequired && (value === undefined || value === "")) {
    return undefined;
  }

  if (value !== undefined) {
    switch (key) {
      case "email":
        if (typeof value === "string" && !isValidEmail(value)) {
          return "Please enter a valid email address.";
        }
        break;
      case "mobile":
        if (typeof value === "string") {
          const countryCode = additionalParams?.countryCode as
            | CountryCode
            | undefined;
          if (!isValidMobile(value, countryCode)) {
            return "Please enter a valid mobile number.";
          }
        }
        break;
      case "password":
        if (typeof value === "string" && !isStrongPassword(value)) {
          return "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.";
        }
        break;
      case "confirmPassword":
        if (typeof value === "string" && value !== additionalParams?.password) {
          return "Passwords do not match.";
        }
        break;
      case "dob":
        if (value instanceof Date && !isValidDateOfBirth(value)) {
          return "You must be between 14 and 150 years old.";
        }
        break;
      case "city":
        if (typeof value === "string" && !isValidCity(value)) {
          return "City can only contain alphabets.";
        }
        break;
      case "fullName":
        if (typeof value === "string" && !isValidFullName(value)) {
          return "Full name can only contain alphabets.";
        }
        break;
      default:
        return undefined;
    }
  }
  return undefined;
};

export const validateLogin = (
  email: string,
  mobile: string | undefined,
  password: string,
  isEmailLogin: boolean,
  countryCode?: CountryCode,
) => {
  const errors: { [key: string]: string } = {};
  if (isEmailLogin) {
    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!isValidEmail(email)) {
      errors.email = "Please enter a valid email address.";
    }
  } else {
    if (!mobile) {
      errors.mobile = "Mobile number is required.";
    } else if (!isValidMobile(mobile, countryCode)) {
      errors.mobile = "Please enter a valid mobile number.";
    }
  }
  if (!password.trim()) {
    errors.password = "Password is required.";
  } else if (!isStrongPassword(password)) {
    errors.password =
      "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.";
  }
  return errors;
};

// Helper function for email validation
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Mobile validation using libphonenumber-js
const isValidMobile = (mobile: string, countryCode?: CountryCode): boolean => {
  const code: CountryCode = countryCode ?? "QA"; // Default to "QA" if no country code is provided
  return (
    isPossiblePhoneNumber(mobile, code) && isValidPhoneNumber(mobile, code)
  );
};

// Function to check for a strong password
export const isStrongPassword = (password: string): boolean => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Function to check if the full name only contains alphabets
export const isValidFullName = (fullName: string): boolean => {
  const nameRegex = /^[A-Za-z\s]+$/;
  return nameRegex.test(fullName);
};

// Function to validate the date of birth and ensure age is between 14 and 150 years
export const isValidDateOfBirth = (dob: Date): boolean => {
  const currentDate = new Date();
  // Calculate the user's age based on the DOB
  var age = currentDate.getFullYear() - dob.getFullYear();
  const monthDifference = currentDate.getMonth() - dob.getMonth();
  const dayDifference = currentDate.getDate() - dob.getDate();
  // Adjust age calculation if the birthdate hasn't occurred yet in the current year
  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age--;
  }
  // Check if the age is between 14 and 150 years
  return age >= 14 && age <= 150;
};

// Function to check if the city name only contains alphabets
export const isValidCity = (city: string): boolean => {
  const cityRegex = /^[A-Za-z\s]+$/;
  return cityRegex.test(city);
};

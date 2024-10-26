import {
  isPossiblePhoneNumber,
  isValidPhoneNumber,
  CountryCode,
} from "libphonenumber-js";

export const validateRegister = (
  fullName: string,
  email: string,
  mobile: string,
  password: string,
  confirmPassword: string,
  dob: Date | undefined,
  gender: string,
  countryCode?: CountryCode | any,
) => {
  const errors: { [key: string]: string } = {};

  // Full Name validation
  if (!fullName.trim()) {
    errors.fullName = "Full name is required.";
  } else if (!isValidFullName(fullName)) {
    errors.fullName = "Full name can only contain alphabets.";
  }

  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!mobile.trim()) {
    errors.mobile = "Mobile number is required.";
  }

  // Password validation
  if (!password.trim()) {
    errors.password = "Password is required.";
  } else if (!isStrongPassword(password)) {
    errors.password =
      "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.";
  }

  // Confirm Password validation
  if (!confirmPassword.trim()) {
    errors.confirmPassword = "Confirm Password is required.";
  }
  if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  // Date of Birth validation
  if (!dob) {
    errors.dob = "Date of birth is required.";
  } else if (!isValidDateOfBirth(dob)) {
    errors.dob = "You must be between 14 and 150 years old.";
  }

  // Gender validation
  if (!gender.trim()) {
    errors.gender = "Gender is required.";
  }

  return errors;
};

export const validateLogin = (
  email: string,
  password: string
) => {
  const errors: { [key: string]: string } = {};
  
  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!password.trim()) {
    errors.password = "Password is required.";
  } else if (!isStrongPassword(password)) {
    errors.password =
      "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.";
  }

  return errors;
};

export const validatePasswordReset = (email: string) => {
  const errors: { [key: string]: string } = {};

  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(email)) {
    errors.email = "Please enter a valid email address.";
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
  const code: CountryCode = countryCode ?? "AE"; // Default to "QA" if no country code is provided
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
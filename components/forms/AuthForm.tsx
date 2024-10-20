import React, { useState } from "react";
import { Checkbox } from "expo-checkbox";
import {
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ICountry } from "react-native-international-phone-number";
import DateOfBirthPicker from "@/components/inputs/DateTimePicker";
import MobileInput from "@/components/inputs/MobileInput";
import { Ionicons } from "@expo/vector-icons";
import {
  validateField,
  validateStep1,
  validateStep2,
  validateLogin,
} from "@/utils/validation";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

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
  dob?: Date;
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

const AuthForm: React.FC<{
  onRegister: (data: any) => void;
  onLogin: (data: any) => void;
  onPasswordReset: (email: string) => void;
}> = ({ onRegister, onLogin, onPasswordReset }) => {
  const [isEmailSignUp, setIsEmailSignUp] = useState(true);
  const [step, setStep] = useState(1);
  const [country, setCountry] = useState<ICountry | null>(null);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    mobile: "",
    countryCode: "",
    gender: "",
    dob: undefined,
    nationality: "",
    residence: "",
    city: "",
    password: "",
    confirmPassword: "",
    isPasswordVisible: false,
    isConfirmPasswordVisible: false,
    subscribeNews: false,
    loginEmail: "",
    loginMobile: "",
    loginPassword: "",
    resetEmail: "",
  });
  // Step 1 Error States
  const [errorsStep1, setErrorsStep1] = useState<{
    [key: string]: string | undefined;
  }>({});
  // Step 2 Error States
  const [errorsStep2, setErrorsStep2] = useState<{
    [key: string]: string | undefined;
  }>({});

  const [showLogin, setShowLogin] = useState(false);
  const [isLoginWithEmail, setIsLoginWithEmail] = useState(true);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  // Login Error States
  const [errorsLogin, setErrorsLogin] = useState<{ [key: string]: string }>({});

  const onChangeInput = (
    key: keyof FormData,
    value: string | boolean | Date | undefined,
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (value === null || value === undefined) {
      setErrorsStep1((prev) => {
        const { [key]: _, ...rest } = prev;
        return rest;
      });
      setErrorsStep2((prev) => {
        const { [key]: _, ...rest } = prev;
        return rest;
      });
      return;
    }
    const additionalParams: AdditionalParams = {};
    if (key === "confirmPassword")
      additionalParams.password = formData.password;
    if (key === "mobile") additionalParams.countryCode = country?.cca2;
    const error = validateField(key, value, false, additionalParams);
    if (isEmailSignUp) {
      if (key === "mobile") return;
    } else {
      if (key === "email") return;
    }
    const setErrors = [
      "email",
      "mobile",
      "password",
      "confirmPassword",
    ].includes(key)
      ? setErrorsStep1
      : setErrorsStep2;
    setErrors((prev) => {
      const newErrors = {
        ...prev,
        [key]: error || undefined,
      };
      return Object.fromEntries(
        Object.entries(newErrors).filter(([_, v]) => v !== undefined),
      );
    });
  };

  const handleNextStep = () => {
    const validationErrors: { [key: string]: string } = {};
    const additionalParams: AdditionalParams = {};
    const keysToValidate = isEmailSignUp
      ? ["email", "password", "confirmPassword"]
      : ["mobile", "password", "confirmPassword"];
    keysToValidate.forEach((key) => {
      if (key === "confirmPassword")
        additionalParams.password = formData.password;
      if (key === "mobile") additionalParams.countryCode = country?.cca2;
      const value = formData[key as keyof FormData];
      const error = validateField(
        key as keyof FormData,
        value,
        true,
        additionalParams,
      );
      if (error) {
        validationErrors[key] = error;
      }
    });
    if (Object.keys(validationErrors).length === 0) {
      setErrorsStep1({});
      setStep(2);
    } else {
      setErrorsStep1(validationErrors);
    }
  };

  const handleSubmit = () => {
    const validationErrors: { [key: string]: string } = {};
    const additionalParams: AdditionalParams = {};
    const fieldsToValidate = [
      "fullName",
      "email",
      "mobile",
      "dob",
      "gender",
      "nationality",
      "residence",
      "city",
    ];

    fieldsToValidate.forEach((key) => {
      const value = formData[key as keyof FormData];
      if (key === "mobile") {
        additionalParams.countryCode = country?.cca2;
      }
      const error = validateField(
        key as keyof FormData,
        value,
        true,
        additionalParams,
      );
      if (error) {
        validationErrors[key] = error;
      }
    });

    if (Object.keys(validationErrors).length === 0) {
      setErrorsStep2({});
      const registrationData = {
        fullName: formData.fullName,
        email: isEmailSignUp ? formData.email : undefined,
        mobile: !isEmailSignUp ? formData.mobile : undefined,
        gender: formData.gender,
        dob: formData.dob,
        nationality: formData.nationality,
        residence: formData.residence,
        city: formData.city,
        subscribeNews: formData.subscribeNews,
      };
      onRegister(registrationData);
    } else {
      setErrorsStep2(validationErrors);
    }
  };

  const handleLogin = () => {
    let validationErrors;
    if (isLoginWithEmail) {
      // Validate only email and password for email login
      validationErrors = validateLogin(
        formData.loginEmail,
        "",
        formData.loginPassword,
        isLoginWithEmail,
      ); // Pass empty string for mobile
    } else {
      // Validate only mobile and password for mobile login
      validationErrors = validateLogin(
        "",
        formData.loginMobile,
        formData.loginPassword,
        isLoginWithEmail,
      ); // Pass empty string for email
    }
    if (Object.keys(validationErrors).length === 0) {
      // If no errors, proceed with login logic
      setErrorsLogin({});
      // Call API or handle the login process
      console.log("Login successful");
    } else {
      // If there are validation errors, set them to the state
      setErrorsLogin(validationErrors);
    }
  };

  const handlePasswordReset = () => {
    onPasswordReset(formData.resetEmail);
    setIsResettingPassword(false); // Return to login after resetting
  };

  const handleToggleSignUp = (type: "email" | "mobile") => {
    setErrorsStep1({});
    setIsEmailSignUp(type === "email");
    onChangeInput(type, ""); // This will clear the email or mobile field based on the type
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      keyboardVerticalOffset={80}
    >
      <ThemedView className="flex-1 justify-center">
        <ThemedView className="bg-white rounded-lg shadow-lg p-3">
          <ThemedView className="items-center p-4">
            <ThemedText className="text-2xl font-bold text-center mb-4">
              Mega Deals
            </ThemedText>
          </ThemedView>
          {isResettingPassword ? (
            <>
              <TextInput
                placeholder="Enter your email"
                value={formData.resetEmail}
                onChangeText={(text) => onChangeInput("resetEmail", text)}
                className="border p-2 mb-2 rounded-md"
              />
              <Pressable
                onPress={handlePasswordReset}
                className="bg-black rounded-lg p-3 shadow-lg mt-4"
              >
                <ThemedText className="text-center text-white">
                  Reset Password
                </ThemedText>
              </Pressable>
              <ThemedText
                className="text-center mt-4 text-black font-bold"
                onPress={() => setIsResettingPassword(false)}
              >
                Back to Login
              </ThemedText>
            </>
          ) : showLogin ? (
            <>
              {/* Login Tabs */}
              <ThemedView className="flex-row mb-4">
                <Pressable
                  className={`flex-1 p-3 rounded-lg ${
                    isLoginWithEmail ? "bg-black" : "bg-gray-200"
                  } mr-2`}
                  onPress={() => setIsLoginWithEmail(true)}
                >
                  <ThemedText
                    className={`text-center ${
                      isLoginWithEmail ? "text-white" : "text-black"
                    }`}
                  >
                    Login With Email
                  </ThemedText>
                </Pressable>
                <Pressable
                  className={`flex-1 p-3 rounded-lg ${
                    !isLoginWithEmail ? "bg-black" : "bg-gray-200"
                  }`}
                  onPress={() => setIsLoginWithEmail(false)}
                >
                  <ThemedText
                    className={`text-center ${
                      !isLoginWithEmail ? "text-white" : "text-black"
                    }`}
                  >
                    Login With Mobile
                  </ThemedText>
                </Pressable>
              </ThemedView>

              {/* Login Form */}
              {isLoginWithEmail ? (
                <ThemedView className="mb-2">
                  <TextInput
                    placeholder="Email"
                    value={formData.loginEmail}
                    onChangeText={(text) => onChangeInput("loginEmail", text)}
                    className="border p-2  rounded-md"
                  />
                  {errorsLogin.email && (
                    <ThemedText className="text-red-500 mt-1">
                      {errorsLogin.email}
                    </ThemedText>
                  )}
                </ThemedView>
              ) : (
                <ThemedView className="mb-2">
                  <MobileInput
                    placeHolder="Enter Mobile"
                    value={formData.loginMobile}
                    onChangeMobile={(text) =>
                      onChangeInput("loginMobile", text)
                    }
                    setCountryCode={setCountry}
                  />
                  {errorsLogin.mobile && (
                    <ThemedText className="text-red-500 mt-1">
                      {errorsLogin.mobile}
                    </ThemedText>
                  )}
                </ThemedView>
              )}
              <>
                <ThemedView className="relative">
                  <ThemedView className="mb-2">
                    <TextInput
                      placeholder="Password"
                      value={formData.loginPassword}
                      onChangeText={(text) => onChangeInput("password", text)}
                      secureTextEntry={!formData.isPasswordVisible}
                      className="border p-2 rounded-md"
                    />
                    {errorsLogin.password && (
                      <ThemedText className="text-red-500 mt-1">
                        {errorsLogin.password}
                      </ThemedText>
                    )}
                  </ThemedView>
                  <Pressable
                    onPress={() =>
                      onChangeInput(
                        "isPasswordVisible",
                        !formData.isPasswordVisible,
                      )
                    }
                    className="absolute right-2 top-2"
                  >
                    <Ionicons
                      name={formData.isPasswordVisible ? "eye-off" : "eye"}
                      size={24}
                      color="gray"
                    />
                  </Pressable>
                </ThemedView>
              </>
              <Pressable
                onPress={handleLogin}
                className="bg-black rounded-lg p-3 shadow-lg mt-4"
              >
                <ThemedText className="text-center text-white">
                  Login
                </ThemedText>
              </Pressable>
              <ThemedText className="text-center mt-4">
                Forgot Password?{" "}
                <ThemedText
                  className="text-black font-bold"
                  onPress={() => setIsResettingPassword(true)}
                >
                  Reset
                </ThemedText>
              </ThemedText>
              <ThemedText className="text-center mt-4">
                Don't have an account?{" "}
                <ThemedText
                  className="text-black font-bold"
                  onPress={() => setShowLogin(false)}
                >
                  Register
                </ThemedText>
              </ThemedText>
            </>
          ) : (
            <>
              {/* Registration Tabs */}
              {step === 1 && (
                <ThemedView className="flex-row mb-4">
                  <Pressable
                    className={`flex-1 p-3 rounded-lg ${
                      isEmailSignUp ? "bg-black" : "bg-gray-200"
                    } mr-2`}
                    onPress={() => handleToggleSignUp("email")}
                  >
                    <ThemedText
                      className={`text-center ${
                        isEmailSignUp ? "text-white" : "text-black"
                      }`}
                    >
                      Sign Up With Email
                    </ThemedText>
                  </Pressable>
                  <Pressable
                    className={`flex-1 p-3 rounded-lg ${
                      !isEmailSignUp ? "bg-black" : "bg-gray-200"
                    }`}
                    onPress={() => handleToggleSignUp("mobile")}
                  >
                    <ThemedText
                      className={`text-center ${
                        !isEmailSignUp ? "text-white" : "text-black"
                      }`}
                    >
                      Sign Up With Mobile
                    </ThemedText>
                  </Pressable>
                </ThemedView>
              )}
              {step === 1 ? (
                <>
                  {/* Step 1: Email/Mobile & Password */}
                  <ScrollView>
                    {isEmailSignUp ? (
                      <ThemedView className="mb-2">
                        <TextInput
                          placeholder="Email"
                          value={formData.email}
                          // onChangeText={setEmail}
                          onChangeText={(text) => onChangeInput("email", text)}
                          className="border p-2 rounded-md"
                        />
                        {errorsStep1.email && (
                          <ThemedText className="text-red-500 mt-1">
                            {errorsStep1.email}
                          </ThemedText>
                        )}
                      </ThemedView>
                    ) : (
                      <>
                        <ThemedView className="mb-2">
                          <MobileInput
                            placeHolder="Enter Mobile"
                            value={formData.mobile}
                            onChangeMobile={(text) =>
                              onChangeInput("mobile", text)
                            }
                            setCountryCode={setCountry}
                          />
                          {errorsStep1.mobile && (
                            <ThemedText className="text-red-500 mt-1">
                              {errorsStep1.mobile}
                            </ThemedText>
                          )}
                        </ThemedView>
                      </>
                    )}
                    <>
                      <ThemedView className="relative">
                        <ThemedView className="mb-2">
                          <TextInput
                            placeholder="Password"
                            value={formData.password}
                            onChangeText={(text) =>
                              onChangeInput("password", text)
                            }
                            secureTextEntry={!formData.isPasswordVisible}
                            className="border p-2 rounded-md"
                          />
                          {errorsStep1.password && (
                            <ThemedText className="text-red-500 mt-1">
                              {errorsStep1.password}
                            </ThemedText>
                          )}
                        </ThemedView>
                        <Pressable
                          onPress={() =>
                            onChangeInput(
                              "isPasswordVisible",
                              !formData.isPasswordVisible,
                            )
                          }
                          className="absolute right-2 top-2"
                        >
                          <Ionicons
                            name={
                              formData.isPasswordVisible ? "eye-off" : "eye"
                            }
                            size={24}
                            color="gray"
                          />
                        </Pressable>
                      </ThemedView>
                    </>
                    <ThemedView className="relative">
                      <TextInput
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChangeText={(text) =>
                          onChangeInput("confirmPassword", text)
                        }
                        secureTextEntry={!formData.isConfirmPasswordVisible}
                        className="border p-2 rounded-md"
                      />
                      {errorsStep1.confirmPassword && (
                        <ThemedText className="text-red-500 mt-1">
                          {errorsStep1.confirmPassword}
                        </ThemedText>
                      )}
                      <Pressable
                        onPress={() =>
                          onChangeInput(
                            "isConfirmPasswordVisible",
                            !formData.isConfirmPasswordVisible,
                          )
                        }
                        className="absolute right-2 top-2"
                      >
                        <Ionicons
                          name={
                            formData.isConfirmPasswordVisible
                              ? "eye-off"
                              : "eye"
                          }
                          size={24}
                          color="gray"
                        />
                      </Pressable>
                    </ThemedView>
                    <ThemedView className="mt-2">
                      <Pressable
                        onPress={handleNextStep}
                        className={`rounded-lg p-3 shadow-lg ${Object.keys(errorsStep1).length > 0 ? "bg-gray-400" : "bg-black"}`}
                        disabled={Object.keys(errorsStep1).length > 0} // Disable if there are errors
                      >
                        <ThemedText className="text-center text-white">
                          Continue
                        </ThemedText>
                      </Pressable>
                    </ThemedView>
                  </ScrollView>
                </>
              ) : (
                <>
                  {/* Step 2: Remaining Fields */}
                  <ScrollView>
                    <ThemedView className="mb-2">
                      <TextInput
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChangeText={(text) => onChangeInput("fullName", text)}
                        className="border p-2 rounded-md"
                      />
                      {errorsStep2.fullName && (
                        <ThemedText className="text-red-500 mt-1">
                          {errorsStep2.fullName}
                        </ThemedText>
                      )}
                    </ThemedView>
                    {isEmailSignUp ? (
                      <ThemedView className="mb-2">
                        <MobileInput
                          placeHolder="Enter Mobile"
                          value={formData.mobile}
                          onChangeMobile={(text) =>
                            onChangeInput("mobile", text)
                          }
                          setCountryCode={setCountry}
                        />
                        {errorsStep2.mobile && (
                          <ThemedText className="text-red-500 mt-1">
                            {errorsStep2.mobile}
                          </ThemedText>
                        )}
                      </ThemedView>
                    ) : (
                      <ThemedView className="mb-2">
                        <TextInput
                          placeholder="Email"
                          value={formData.email}
                          onChangeText={(text) => onChangeInput("email", text)}
                          className="border p-2 rounded-md"
                        />
                        {errorsStep2.email && (
                          <ThemedText className="text-red-500">
                            {errorsStep2.email}
                          </ThemedText>
                        )}
                      </ThemedView>
                    )}
                    <ThemedView className="mb-2">
                      <ThemedView className="border p-2 rounded-md">
                        <DateOfBirthPicker
                          dob={formData.dob}
                          setDob={(text) => onChangeInput("dob", text)}
                        />
                      </ThemedView>
                      {errorsStep2.dob && (
                        <ThemedText className="text-red-500 mt-1">
                          {errorsStep2.dob}
                        </ThemedText>
                      )}
                    </ThemedView>
                    <ThemedView className="mb-2">
                      <ThemedView className="flex-row">
                        {["Male", "Female"].map((option) => (
                          <Pressable
                            key={option}
                            onPress={() => onChangeInput("dob", option)}
                            className={`flex-1 p-3 rounded-lg ${
                              formData.gender === option
                                ? "bg-black"
                                : "bg-gray-200"
                            }`}
                            style={{ marginRight: option === "Male" ? 8 : 0 }}
                          >
                            <ThemedText
                              className={`text-center ${
                                formData.gender === option
                                  ? "text-white"
                                  : "text-black"
                              }`}
                            >
                              {option}
                            </ThemedText>
                          </Pressable>
                        ))}
                      </ThemedView>
                      {errorsStep2.gender && (
                        <ThemedText className="text-red-500 mt-1">
                          {errorsStep2.gender}
                        </ThemedText>
                      )}
                    </ThemedView>
                    <ThemedView className="mb-2">
                      <TextInput
                        placeholder="Nationality"
                        value={formData.nationality}
                        onChangeText={(text) =>
                          onChangeInput("nationality", text)
                        }
                        className="border p-2  rounded-md"
                      />
                      {errorsStep2.nationality && (
                        <ThemedText className="text-red-500 mt-1">
                          {errorsStep2.nationality}
                        </ThemedText>
                      )}
                    </ThemedView>
                    <ThemedView className="mb-2">
                      <TextInput
                        placeholder="Residence"
                        value={formData.residence}
                        onChangeText={(text) =>
                          onChangeInput("residence", text)
                        }
                        className="border p-2  rounded-md"
                      />
                      {errorsStep2.residence && (
                        <ThemedText className="text-red-500 mt-1">
                          {errorsStep2.residence}
                        </ThemedText>
                      )}
                    </ThemedView>
                    <ThemedView className="mb-2">
                      <TextInput
                        placeholder="City"
                        value={formData.city}
                        onChangeText={(text) => onChangeInput("city", text)}
                        className="border p-2 rounded-md"
                      />
                      {errorsStep2.city && (
                        <ThemedText className="text-red-500 mt-1">
                          {errorsStep2.city}
                        </ThemedText>
                      )}
                    </ThemedView>
                    <ThemedView className="flex-row items-center mb-4">
                      <Checkbox
                        value={formData.subscribeNews}
                        onValueChange={(text) =>
                          onChangeInput(
                            "subscribeNews",
                            !formData.subscribeNews,
                          )
                        }
                        color={
                          formData.subscribeNews
                            ? "hsl(220, 89.74358974358974%, 54.11764705882353%)"
                            : undefined
                        }
                      />
                      <ThemedText className="ml-2">
                        Subscribe to news and offers
                      </ThemedText>
                    </ThemedView>
                    <Pressable
                      onPress={handleSubmit}
                      className={`rounded-lg p-3 shadow-lg ${Object.keys(errorsStep2).length > 0 ? "bg-gray-400" : "bg-black"}`}
                      disabled={Object.keys(errorsStep2).length > 0}
                    >
                      <ThemedText className="text-center text-white">
                        Sign Up
                      </ThemedText>
                    </Pressable>
                  </ScrollView>
                  <Pressable onPress={() => setStep(1)} className="mt-4">
                    <ThemedText className="text-center text-black">
                      Go Back
                    </ThemedText>
                  </Pressable>
                </>
              )}
              <ThemedText className="text-center mt-4">
                Already have an account?{" "}
                <ThemedText
                  className="text-black font-bold"
                  onPress={() => setShowLogin(true)}
                >
                  Login
                </ThemedText>
              </ThemedText>
            </>
          )}
        </ThemedView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
};

export default AuthForm;

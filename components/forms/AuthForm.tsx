import React, { useState } from "react";
import {
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  View,
} from "react-native";
import {
  validateLogin,
  validateRegister,
  validatePasswordReset,
} from "@/utils/validation";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import DateOfBirthPicker from "@/components/inputs/DateTimePicker";
import MobileInput from "@/components/inputs/MobileInput";
import { useLanguage } from "@/contexts/LanguageContext";
import { ICountry } from "react-native-international-phone-number";
import GenderInput from "@/components/inputs/GenderInput";
import { Ionicons } from "@expo/vector-icons";
import OTPView from "@/components/OTPView";

interface RegisterFormData {
  fullName: string;
  email: string;
  mobile: string;
  country: {
    callingCode: string;
    cca2: string;
    flag: string;
    name: any;
  };
  gender: string;
  dob: Date;
  password: string;
  confirmPassword: string;
}

interface LoginFormData {
  email: string;
  password: string;
}

const AuthForm: React.FC<{
  onRegister: (data: RegisterFormData) => void;
  onLogin: (data: LoginFormData) => void;
  onPasswordReset: (email: string) => void;
  onOTPVerify: (email: string, otp: string) => void;
  onResendOTP: (email: string) => void;
}> = ({ onRegister, onLogin, onPasswordReset, onOTPVerify, onResendOTP}) => {
  const [formType, setFormType] = useState<"login" | "register" | "reset">(
    "login"
  );
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: "",
    email: "",
    mobile: "",
    country: { callingCode: "", cca2: "", flag: "", name: {} as any },
    gender: "",
    dob: new Date(),
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { getColor } = useThemeColor();
  const { i18n, locale, changeLanguage, isRTL } = useLanguage();
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [otp, setOTP] = useState("");
  const [verifyOTPLoading, setVerifyOTPLoading] = useState(false);
  const [resendOTPLoading, setResendOTPLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleLogin = async () => {
    const validationErrors = validateLogin(formData.email, formData.password);
    if (Object.keys(validationErrors).length === 0) {
      setErrors({});
      setLoginLoading(true);
      try {
        const response = await onLogin({
          email: formData.email,
          password: formData.password,
        });
        setErrors({ api: "Invalid login credentials." });
      } catch (error) {
        setErrors({ api: "An unexpected error occurred. Please try again." });
      } finally {
        setLoginLoading(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const handleRegister = async () => {
    const validationErrors = validateRegister(
      formData.fullName,
      formData.email,
      formData.mobile,
      formData.password,
      formData.confirmPassword,
      formData.dob,
      formData.gender
    );

    if (Object.keys(validationErrors).length === 0) {
      setErrors({});
      setRegisterLoading(true);
      try {
        await onRegister(formData);
        setShowOTPForm(true); // Show OTP form after successful registration
      } catch (error) {
        if (error instanceof Error) {
          setErrors({ api: error.message });
        } else {
          setErrors({ api: "An unknown error occurred" });
        }
      } finally {
        setRegisterLoading(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const handlePasswordReset = async () => {
    const validationErrors = validatePasswordReset(formData.email);
    if (Object.keys(validationErrors).length === 0) {
      setErrors({});
      setResetLoading(true);
      try {
        await onPasswordReset(formData.email);
        setFormType("login");
      } finally {
        setResetLoading(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const handleOTPVerify = async () => {
    if (otp.length === 6) {
      setVerifyOTPLoading(true);
      try {
        await onOTPVerify(formData.email, otp);
        setFormType("login");
      } catch (error) {
        console.error("OTP verification failed:", error);
        setErrors({ otp: "OTP verification failed. Please try again." });
      } finally {
        setVerifyOTPLoading(false);
      }
    } else {
      setErrors({ otp: "Please enter a valid 6-digit OTP" });
    }
  };

  const handleResendOTP = async () => {
    setResendOTPLoading(true);
    try {
      await onResendOTP(formData.email);
      // You might want to show a success message here
    } catch (error) {
      console.error("Resending OTP failed:", error);
      // You might want to show an error message here
    } finally {
      setResendOTPLoading(false);
    }
  };

  const onChangeInput = (key: keyof RegisterFormData, value: string | Date) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const setCountryCode = (country: ICountry) => {
    setFormData((prev) => ({
      ...prev,
      countryCode: country.callingCode,
      dialCode: country.cca2,
    }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      keyboardVerticalOffset={80}
    >
      <ThemedView className="flex-row justify-end pt-10 mr-5">
        <Pressable
          onPress={() => changeLanguage(locale === "en" ? "ar" : "en")}
        >
          <Ionicons name="language" size={22} color={getColor("text")} />
        </Pressable>
      </ThemedView>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedView className="flex-1 justify-center p-4">
          {showOTPForm ? (
            <ThemedView className="items-center">
              <OTPView
                otp={otp}
                setOtp={setOTP}
                handleVerifyOtp={handleOTPVerify}
                handleResendOtp={handleResendOTP}
                verifyLoading={verifyOTPLoading}
                resendLoading={resendOTPLoading}
              />
            </ThemedView>
          ) : (
            <>
              <ThemedText
                className={`text-3xl font-bold mb-6 ${isRTL ? "text-right" : "text-left"}`}
                style={{ color: getColor("text") }}
              >
                {formType === "login"
                  ? i18n.t("auth.login")
                  : formType === "register"
                    ? i18n.t("auth.register")
                    : i18n.t("auth.resetPassword")}
              </ThemedText>

              {formType === "login" && (
                <>
                  <TextInput
                    placeholder={i18n.t("auth.email")}
                    value={formData.email}
                    onChangeText={(text) => onChangeInput("email", text)}
                    className="border p-3 rounded-md mb-2"
                    style={{ borderColor: getColor("border") }}
                  />
                  {errors.email && (
                    <ThemedText className="text-red-500 mb-2">
                      {errors.email}
                    </ThemedText>
                  )}
                  <View className="relative">
                    <TextInput
                      placeholder={i18n.t("auth.password")}
                      value={formData.password}
                      onChangeText={(text) => onChangeInput("password", text)}
                      secureTextEntry={!showPassword}
                      className="border p-3 rounded-md mb-2 pr-10"
                      style={{ borderColor: getColor("border") }}
                    />
                    <Pressable
                      onPress={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3"
                    >
                      <Ionicons
                        name={showPassword ? "eye-off" : "eye"}
                        size={24}
                        color={getColor("text")}
                      />
                    </Pressable>
                  </View>
                  {errors.password && (
                    <ThemedText className="text-red-500 mb-2">
                      {errors.password}
                    </ThemedText>
                  )}
                  {errors.api && (
                    <ThemedText className="text-red-500 mb-2">
                      {errors.api}
                    </ThemedText>
                  )}
                  <Pressable
                    onPress={handleLogin}
                    className="bg-black rounded-lg p-3 shadow-lg mt-4"
                    style={{ backgroundColor: getColor("primary") }}
                    disabled={loginLoading}
                  >
                    {loginLoading ? (
                      <ActivityIndicator color={getColor("secondary")} />
                    ) : (
                      <ThemedText className="text-center text-white">
                        {i18n.t("auth.login")}
                      </ThemedText>
                    )}
                  </Pressable>
                  <ThemedText className="text-center mt-4">
                    {i18n.t("auth.noAccount")}{" "}
                    <ThemedText
                      className="text-black font-bold"
                      onPress={() => setFormType("register")}
                      style={{ color: getColor("primary") }}
                    >
                      {i18n.t("auth.register")}
                    </ThemedText>
                  </ThemedText>
                  <ThemedText className="text-center mt-2">
                    {i18n.t("auth.forgotPassword")}{" "}
                    <ThemedText
                      className="text-black font-bold"
                      onPress={() => setFormType("reset")}
                      style={{ color: getColor("primary") }}
                    >
                      {i18n.t("auth.reset")}
                    </ThemedText>
                  </ThemedText>
                </>
              )}

              {formType === "register" && (
                <>
                  <TextInput
                    placeholder={i18n.t("auth.fullName")}
                    value={formData.fullName}
                    onChangeText={(text) => onChangeInput("fullName", text)}
                    className="border p-3 rounded-md mb-2"
                    style={{ borderColor: getColor("border") }}
                  />
                  {errors.fullName && (
                    <ThemedText className="text-red-500 mb-2">
                      {errors.fullName}
                    </ThemedText>
                  )}
                  <TextInput
                    placeholder={i18n.t("auth.email")}
                    value={formData.email}
                    onChangeText={(text) => onChangeInput("email", text)}
                    className="border p-3 rounded-md mb-2"
                    style={{ borderColor: getColor("border") }}
                  />
                  {errors.email && (
                    <ThemedText className="text-red-500 mb-2">
                      {errors.email}
                    </ThemedText>
                  )}
                  <ThemedView className="mb-2">
                    <MobileInput
                      placeHolder={i18n.t("auth.mobile")}
                      value={formData.mobile}
                      onChangeMobile={(text) => onChangeInput("mobile", text)}
                      setCountryCode={setCountryCode}
                      defaultCountry={formData.country}
                    />
                  </ThemedView>
                  {errors.mobile && (
                    <ThemedText className="text-red-500 mb-2">
                      {errors.mobile}
                    </ThemedText>
                  )}
                  <GenderInput
                    value={formData.gender}
                    onChangeGender={(gender) => onChangeInput("gender", gender)}
                  />
                  {errors.gender && (
                    <ThemedText className="text-red-500 mb-2">
                      {errors.gender}
                    </ThemedText>
                  )}
                  <DateOfBirthPicker
                    dob={formData.dob}
                    setDob={(date) => onChangeInput("dob", date)}
                  />
                  {errors.dob && (
                    <ThemedText className="text-red-500 mb-2">
                      {errors.dob}
                    </ThemedText>
                  )}
                  <View className="relative">
                    <TextInput
                      placeholder={i18n.t("auth.password")}
                      value={formData.password}
                      onChangeText={(text) => onChangeInput("password", text)}
                      secureTextEntry={!showPassword}
                      className="border p-3 rounded-md mb-2 pr-10"
                      style={{ borderColor: getColor("border") }}
                    />
                    <Pressable
                      onPress={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3"
                    >
                      <Ionicons
                        name={showPassword ? "eye-off" : "eye"}
                        size={24}
                        color={getColor("text")}
                      />
                    </Pressable>
                  </View>
                  {errors.password && (
                    <ThemedText className="text-red-500 mb-2">
                      {errors.password}
                    </ThemedText>
                  )}
                  <View className="relative">
                    <TextInput
                      placeholder={i18n.t("auth.confirmPassword")}
                      value={formData.confirmPassword}
                      onChangeText={(text) =>
                        onChangeInput("confirmPassword", text)
                      }
                      secureTextEntry={!showConfirmPassword}
                      className="border p-3 rounded-md mb-2 pr-10"
                      style={{ borderColor: getColor("border") }}
                    />
                    <Pressable
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3"
                    >
                      <Ionicons
                        name={showConfirmPassword ? "eye-off" : "eye"}
                        size={24}
                        color={getColor("text")}
                      />
                    </Pressable>
                  </View>
                  {errors.confirmPassword && (
                    <ThemedText className="text-red-500 mb-2">
                      {errors.confirmPassword}
                    </ThemedText>
                  )}
                  <Pressable
                    onPress={handleRegister}
                    className="bg-black rounded-lg p-3 shadow-lg mt-4"
                    style={{ backgroundColor: getColor("primary") }}
                    disabled={registerLoading}
                  >
                    {registerLoading ? (
                      <ActivityIndicator color={getColor("secondary")} />
                    ) : (
                      <ThemedText className="text-center text-white">
                        {i18n.t("auth.register")}
                      </ThemedText>
                    )}
                  </Pressable>
                  <ThemedText className="text-center mt-4">
                    {i18n.t("auth.haveAccount")}{" "}
                    <ThemedText
                      className="text-black font-bold"
                      onPress={() => setFormType("login")}
                      style={{ color: getColor("primary") }}
                    >
                      {i18n.t("auth.login")}
                    </ThemedText>
                  </ThemedText>
                </>
              )}

              {formType === "reset" && (
                <>
                  <TextInput
                    placeholder={i18n.t("auth.enterEmail")}
                    value={formData.email}
                    onChangeText={(text) => onChangeInput("email", text)}
                    className="border p-2 mb-2 rounded-md"
                    style={{ borderColor: getColor("border") }}
                  />
                  {errors.email && (
                    <ThemedText className="text-red-500 mb-2">
                      {errors.email}
                    </ThemedText>
                  )}
                  <Pressable
                    onPress={handlePasswordReset}
                    className="bg-black rounded-lg p-3 shadow-lg mt-4"
                    style={{ backgroundColor: getColor("primary") }}
                    disabled={resetLoading}
                  >
                    {resetLoading ? (
                      <ActivityIndicator color={getColor("secondary")} />
                    ) : (
                      <ThemedText className="text-center text-white">
                        {i18n.t("auth.resetPassword")}
                      </ThemedText>
                    )}
                  </Pressable>
                  <ThemedText
                    className="text-center mt-4 text-black font-bold"
                    onPress={() => setFormType("login")}
                    style={{ color: getColor("primary") }}
                  >
                    {i18n.t("auth.backToLogin")}
                  </ThemedText>
                </>
              )}
            </>
          )}
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AuthForm;

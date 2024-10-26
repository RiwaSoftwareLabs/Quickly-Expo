import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { supabase } from "@/utils/api/apiClient";
import { User } from "@supabase/supabase-js";
import { Alert } from 'react-native';

interface RegisterFormData {
  fullName: string;
  email: string;
  mobile: string;
  countryCode: string;
  dialCode: string;
  gender: string;
  dob: Date;
  password: string;
  confirmPassword: string;
}

export const useProfileLogic = () => {
  const { i18n, locale, changeLanguage } = useLanguage();
  const { selectedCurrency, changeCurrency } = useCurrency();
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    setIsLoggedIn(!!session);
    if (session) {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
      } else {
        setUser(user);
      }
    } else {
      setUser(null);
    }
  };

  const handleLanguageChange = (lang: string) => {
    let newLanguage = lang === "ar" ? "en" : "ar";
    changeLanguage(newLanguage);
  };

  const handleCurrencyChange = (currencyCode: string) => {
    changeCurrency(currencyCode);
    setCurrencyModalVisible(false);
  };

  const handleRegister = async (data: RegisterFormData) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            mobile: data.mobile,
            country_code: data.countryCode,
            dial_code: data.dialCode,
            gender: data.gender,
            dob: data.dob.toISOString()
          },
        },
      });
      if (error) throw error;
      // Don't set isLoggedIn here, as we need OTP verification
    } catch (error) {
      Alert.alert(
        "Registration Error",
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      throw error;
    }
  };  

  const handleLogin = async (data: any) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) throw error;
      setIsLoggedIn(true);
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      Alert.alert("Login Error", errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const handlePasswordReset = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      Alert.alert("Success", "Password reset email sent");
    } catch (error) {
      Alert.alert(
        "Password Reset Error",
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  const handleLogout = () => {
    Alert.alert(
      i18n.t('auth.logoutConfirmTitle'),
      i18n.t('auth.logoutConfirmMessage'),
      [
        {
          text: i18n.t('common.cancel'),
          style: 'cancel'
        },
        {
          text: i18n.t('common.ok'),
          onPress: async () => {
            try {
              await supabase.auth.signOut();
              setIsLoggedIn(false);
            } catch (error) {
              console.error("Error logging out:", error);
              Alert.alert(
                "Logout Error",
                error instanceof Error ? error.message : "An unknown error occurred"
              );
            }
          }
        }
      ],
      { cancelable: false }
    );
  };

  const handleOTPVerify = async (email: string, otp: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email,
        token: otp,
        type: 'signup'
      });
      if (error) throw error;
      setIsLoggedIn(true);
    } catch (error) {
      Alert.alert(
        "OTP Verification Error",
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      throw error;
    }
  };

  const resendOTP = async (email: string) => {
    try {
      await supabase.auth.resend({ email: email, type: 'signup' });
    } catch (error) {
      console.error("Error resending OTP:", error);
    }
  };

  return {
    isLoggedIn,
    user,
    locale,
    selectedCurrency,
    currencyModalVisible,
    handleLanguageChange,
    handleCurrencyChange,
    setCurrencyModalVisible,
    handleRegister,
    handleLogin,
    handlePasswordReset,
    handleLogout,
    handleOTPVerify,
    resendOTP,
    i18n
  };
};

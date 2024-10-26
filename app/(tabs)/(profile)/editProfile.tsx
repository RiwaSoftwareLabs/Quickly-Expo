import React, { useState, useEffect } from "react";
import {
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useProfileLogic } from "@/hooks/useProfileLogic";
import { useLanguage } from "@/contexts/LanguageContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import DateOfBirthPicker from "@/components/inputs/DateTimePicker";
import MobileInput from "@/components/inputs/MobileInput";
import GenderInput from "@/components/inputs/GenderInput";
import { supabase } from "@/utils/api/apiClient";
import { ICountry } from "react-native-international-phone-number";
import OTPView from "@/components/OTPView";

const EditProfileScreen: React.FC = () => {
  const { user } = useProfileLogic();
  const { i18n, isRTL } = useLanguage();
  const { getColor } = useThemeColor();
  const router = useRouter();

  const [formData, setFormData] = useState(() => ({
    fullName: user?.user_metadata?.full_name || "",
    email: user?.email || "",
    mobile: user?.user_metadata?.mobile || "",
    country: user?.user_metadata?.country || {
      callingCode: "+971",
      cca2: "AE",
    },
    gender: user?.user_metadata?.gender || "",
    dob: user?.user_metadata?.dob
      ? new Date(user.user_metadata.dob)
      : new Date(),
  }));

  const [isEmailChanged, setIsEmailChanged] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const onChangeInput = (key: string, value: string | Date) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (key === "email" && value !== user?.email) {
      setIsEmailChanged(true);
    } else if (key === "email" && value === user?.email) {
      setIsEmailChanged(false);
    }
  };

  const setCountryCode = (country: ICountry) => {
    console.log("country: ", country);
    setFormData((prev) => ({
      ...prev,
      country,
    }));
  };

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      if (isEmailChanged) {
        const { error } = await supabase.auth.updateUser({
          email: formData.email,
        });
        if (error) throw error;
        setShowOtpInput(true);
      } else {
        await updateUserMetadata();
      }
    } catch (error) {
      Alert.alert(
        i18n.t("common.error"),
        error instanceof Error ? error.message : i18n.t("common.unknownError")
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOTPVerify = async (email: string, otp: string) => {
    setVerifyLoading(true);
    if (otp.length === 6) {
      try {
        const { error } = await supabase.auth.verifyOtp({
          email: email,
          token: otp,
          type: "email_change",
        });
        if (error) throw error;
        await updateUserMetadata();
        setShowOtpInput(false);
        setVerifyLoading(false);
      } catch (error) {
        setVerifyLoading(false);
        Alert.alert(
          "OTP Verification Error",
          error instanceof Error ? error.message : "An unknown error occurred"
        );
        throw error;
      }
    }
  };

  const updateUserMetadata = async () => {
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: formData.fullName,
        mobile: formData.mobile,
        country: formData.country,
        gender: formData.gender,
        dob: formData.dob.toISOString(),
      },
    });

    if (error) throw error;
    Alert.alert(i18n.t("common.success"), i18n.t("profile.updateSuccess"));
    router.back();
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "email_change",
        email: formData.email,
      });
      if (error) throw error;
      Alert.alert(i18n.t("common.success"), i18n.t("auth.otpResent"));
      setResendLoading(false);
    } catch (error) {
      setResendLoading(false);
      Alert.alert(
        i18n.t("common.error"),
        error instanceof Error ? error.message : i18n.t("common.unknownError")
      );
    }
  };

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        fullName: user.user_metadata?.full_name || "",
        email: user.email || "",
        mobile: user.user_metadata?.mobile || "",
        country: user.user_metadata?.country || { callingCode: "", cca2: "" },
        gender: user.user_metadata?.gender || "",
        dob: user.user_metadata?.dob
          ? new Date(user.user_metadata.dob)
          : new Date(),
      }));
    }
  }, [user]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      {showOtpInput ? (
        <ThemedView style={{ flex: 1, justifyContent: "center" }}>
          <OTPView
            otp={otp}
            setOtp={setOtp}
            handleVerifyOtp={() => handleOTPVerify(formData.email, otp)}
            handleResendOtp={handleResendOtp}
            verifyLoading={verifyLoading}
            resendLoading={resendLoading}
          />
        </ThemedView>
      ) : (
        <ScrollView
          style={{ flex: 1, backgroundColor: getColor("background") }}
          contentContainerStyle={{ padding: 16 }}
        >
          <ThemedText
            style={{ marginBottom: 5, textAlign: isRTL ? "right" : "left" }}
          >
            {i18n.t("auth.fullName")}
          </ThemedText>
          <TextInput
            value={formData.fullName}
            onChangeText={(text) => onChangeInput("fullName", text)}
            style={{
              borderWidth: 1,
              borderColor: getColor("border"),
              borderRadius: 5,
              padding: 10,
              marginBottom: 15,
              color: getColor("text"),
              textAlign: isRTL ? "right" : "left",
            }}
          />
          <ThemedText
            style={{ marginBottom: 5, textAlign: isRTL ? "right" : "left" }}
          >
            {i18n.t("auth.email")}
          </ThemedText>
          <TextInput
            value={formData.email}
            onChangeText={(text) => onChangeInput("email", text)}
            style={{
              borderWidth: 1,
              borderColor: getColor("border"),
              borderRadius: 5,
              padding: 10,
              marginBottom: 15,
              color: getColor("text"),
              textAlign: isRTL ? "right" : "left",
            }}
          />

          <ThemedText
            style={{ marginBottom: 5, textAlign: isRTL ? "right" : "left" }}
          >
            {i18n.t("auth.mobile")}
          </ThemedText>
          <ThemedView style={{ marginBottom: 15 }}>
            <MobileInput
              value={formData.mobile}
              onChangeMobile={(text) => onChangeInput("mobile", text)}
              setCountryCode={setCountryCode}
              placeHolder={i18n.t("auth.mobile")}
              defaultCountry={formData.country}
            />
          </ThemedView>

          <ThemedText
            style={{ marginBottom: 5, textAlign: isRTL ? "right" : "left" }}
          >
            {i18n.t("auth.gender")}
          </ThemedText>
          <GenderInput
            value={formData.gender}
            onChangeGender={(gender) => onChangeInput("gender", gender)}
          />

          <ThemedText
            style={{ marginBottom: 5, textAlign: isRTL ? "right" : "left" }}
          >
            {i18n.t("auth.dob")}
          </ThemedText>
          <DateOfBirthPicker
            dob={formData.dob}
            setDob={(date) => onChangeInput("dob", date)}
          />
          <Pressable
            onPress={handleUpdateProfile}
            className="bg-black rounded-lg p-3 shadow-lg mt-4 w-full"
            style={{ backgroundColor: getColor("primary") }}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <ActivityIndicator color={getColor("secondary")} />
            ) : (
              <ThemedText className="text-center text-white">
                {i18n.t("profile.updateProfile")}
              </ThemedText>
            )}
          </Pressable>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
};

export default EditProfileScreen;

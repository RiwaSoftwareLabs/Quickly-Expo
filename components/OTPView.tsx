import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { OtpInput } from "react-native-otp-entry";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useLanguage } from '@/contexts/LanguageContext';
import { ActivityIndicator } from 'react-native';

interface OTPViewProps {
  otp: string;
  setOtp: (otp: string) => void;
  handleVerifyOtp: () => void;
  handleResendOtp: () => void;
  verifyLoading: boolean;
  resendLoading: boolean;
}

const OTPView: React.FC<OTPViewProps> = ({ otp, setOtp, handleVerifyOtp, handleResendOtp, verifyLoading, resendLoading }) => {
  const { getColor } = useThemeColor();
  const { i18n, isRTL } = useLanguage();

  const styles = StyleSheet.create({
    container: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    pinCodeContainer: {
      borderWidth: 1,
      borderColor: getColor("border"),
      borderRadius: 5,
      padding: 10,
    },
    pinCodeText: {
      color: getColor("text"),
      fontSize: 16,
    },
    focusStick: {
      backgroundColor: getColor("primary"),
    },
    activePinCodeContainer: {
      borderColor: getColor("primary"),
    },
  });

  return (
    <ThemedView style={{ paddingHorizontal: 16 }}>
      <ThemedText
        style={{ marginBottom: 5, textAlign: isRTL ? "right" : "left" }}
      >
        {i18n.t("auth.enterOTP")}
      </ThemedText>
      <OtpInput
        numberOfDigits={6}
        focusColor={getColor("primary")}
        focusStickBlinkingDuration={500}
        onTextChange={setOtp}
        onFilled={handleVerifyOtp}
        textInputProps={{
          accessibilityLabel: "One-Time Password",
        }}
        theme={{
          containerStyle: styles.container,
          pinCodeContainerStyle: styles.pinCodeContainer,
          pinCodeTextStyle: styles.pinCodeText,
          focusStickStyle: styles.focusStick,
          focusedPinCodeContainerStyle: styles.activePinCodeContainer,
        }}
      />
      <Pressable
        onPress={handleVerifyOtp}
        style={{
          backgroundColor: getColor("primary"),
          padding: 15,
          borderRadius: 5,
          alignItems: "center",
          marginBottom: 15,
        }}
        disabled={verifyLoading}
      >
        {verifyLoading ? (
          <ActivityIndicator color={getColor("background")} />
        ) : (
          <ThemedText style={{ color: getColor("background") }}>
            {i18n.t("auth.verifyOTP")}
          </ThemedText>
        )}
      </Pressable>
      <Pressable onPress={handleResendOtp} disabled={resendLoading}>
        {resendLoading ? (
          <ActivityIndicator color={getColor("primary")} />
        ) : (
          <ThemedText
            style={{
              color: getColor("primary"),
              textAlign: "center",
            }}
          >
            {i18n.t("auth.resendOTP")}
          </ThemedText>
        )}
      </Pressable>
    </ThemedView>
  );
};

export default OTPView;

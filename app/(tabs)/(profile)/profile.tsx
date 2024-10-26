import React from "react";
import { ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import ProfileAvatar from "@/components/ProfileAvatar";
import ProfileListElement from "@/components/elements/ProfileListElement";
import AuthForm from "@/components/forms/AuthForm";
import { ThemedView } from "@/components/ThemedView";
import { useProfileLogic } from "@/hooks/useProfileLogic";
import CurrencyModal from "@/components/modals/CurrencyModal";
import { useThemeColor } from "@/hooks/useThemeColor";

const ProfileScreen: React.FC = () => {
  const { getColor, toggleTheme, theme } = useThemeColor();
  const {
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
    handleOTPVerify,
    handleLogout,
    resendOTP,
    i18n,
  } = useProfileLogic();

  const renderLoggedInContent = () => (
    <ThemedView style={{ flex: 1 }}>
      <ThemedView className="w-full items-center pt-5">
        <ProfileAvatar
          imageUri={user?.user_metadata?.avatar_url || "https://via.placeholder.com/100"}
          name={user?.user_metadata?.full_name || "User"}
          email={user?.email || ""}
        />
      </ThemedView>
      <ThemedView className="mt-6 w-full flex-1">
        <ProfileListElement
          leftIcon={theme === "dark" ? "language" : "language-outline"}
          rightIcon="chevron-forward"
          label={i18n.t("profile.chooseLanguage")}
          selectedValue={i18n.t("profile.locale")}
          onValueChange={() => handleLanguageChange(locale)}
        />
        <ProfileListElement
          leftIcon={theme === "dark" ? "wallet" : "wallet-outline"}
          rightIcon="chevron-forward"
          label={i18n.t("profile.chooseCurrency")}
          selectedValue={selectedCurrency}
          onValueChange={() => setCurrencyModalVisible(true)}
        />
        <ProfileListElement
          leftIcon={theme === "dark" ? "moon" : "sunny"}
          rightIcon="chevron-forward"
          label={i18n.t("profile.chooseAppearance")}
          selectedValue={i18n.t(
            theme === "dark" ? "profile.dark" : "profile.light"
          )}
          onValueChange={toggleTheme}
        />
        <ProfileListElement
          leftIcon={theme === "dark" ? "book" : "book-outline"}
          rightIcon="chevron-forward"
          label={i18n.t("legal.title")}
          selectedValue={""}
          onValueChange={() => router.push("/(tabs)/(legal)/legal")}
        />
        <ProfileListElement
          leftIcon={theme === "dark" ? "help-circle" : "help-circle-outline"}
          rightIcon="chevron-forward"
          label={i18n.t("faq.title")}
          selectedValue={""}
          onValueChange={() => router.push("/(tabs)/(profile)/faq")}
        />
        <ProfileListElement
          leftIcon={
            theme === "dark"
              ? "information-circle"
              : "information-circle-outline"
          }
          rightIcon="chevron-forward"
          label={i18n.t("about.title")}
          selectedValue={""}
          onValueChange={() => router.push("/(tabs)/(profile)/about")}
        />
        <ProfileListElement
          leftIcon={theme === "dark" ? "help-buoy" : "help-buoy-outline"}
          rightIcon="chevron-forward"
          label={i18n.t("help.title")}
          selectedValue={""}
          onValueChange={() => router.push("/(tabs)/(profile)/help")}
        />
        <ProfileListElement
          leftIcon={theme === "dark" ? "log-out" : "log-out-outline"}
          rightIcon="chevron-forward"
          label={i18n.t("auth.logout")}
          selectedValue={""}
          onValueChange={handleLogout}
        />
      </ThemedView>
    </ThemedView>
  );

  console.log(isLoggedIn);

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      className="pt-4"
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor: getColor("background") }}
    >
      {isLoggedIn ? (
        renderLoggedInContent()
      ) : (
        <AuthForm
          onRegister={handleRegister}
          onLogin={handleLogin}
          onPasswordReset={handlePasswordReset}
          onOTPVerify={handleOTPVerify}
          onResendOTP={resendOTP}
        />
      )}
      <CurrencyModal
        visible={currencyModalVisible}
        onClose={() => setCurrencyModalVisible(false)}
        selectedCurrency={selectedCurrency}
        onCurrencySelect={handleCurrencyChange}
      />
    </ScrollView>
  );
};

export default ProfileScreen;

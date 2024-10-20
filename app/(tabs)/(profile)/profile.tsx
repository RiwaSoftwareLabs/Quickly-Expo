import React from "react";
import { ScrollView } from "react-native";
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
    locale,
    selectedCurrency,
    currencyModalVisible,
    handleLanguageChange,
    handleCurrencyChange,
    setCurrencyModalVisible,
    handleRegister,
    handleLogin,
    handlePasswordReset,
    i18n,
  } = useProfileLogic();

  const renderLoggedInContent = () => (
    <ThemedView style={{ flex: 1 }}>
      <ThemedView className="w-full items-center pt-5">
        <ProfileAvatar
          imageUri="https://via.placeholder.com/100"
          name="BAYC"
          email="abdul@tycheros.net"
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
          leftIcon={theme === "dark" ? "newspaper" : "newspaper-outline"}
          rightIcon="chevron-forward"
          label={i18n.t("news.title")}
          selectedValue={""}
          onValueChange={() => router.push("/(tabs)/(news)/news")}
        />
        <ProfileListElement
          leftIcon={theme === "dark" ? "book" : "book-outline"}
          rightIcon="chevron-forward"
          label={i18n.t("legal.title")}
          selectedValue={""}
          onValueChange={() => router.push("/(tabs)/(legal)/legal")}
        />
        <ProfileListElement
          leftIcon={theme === "dark" ? "document" : "document-outline"}
          rightIcon="chevron-forward"
          label={i18n.t("csr.title")}
          selectedValue={""}
          onValueChange={() => router.push("/(tabs)/(profile)/csr")}
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
      </ThemedView>
    </ThemedView>
  );

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

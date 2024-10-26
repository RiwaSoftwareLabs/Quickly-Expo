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
import { ThemedText } from "@/components/ThemedText";

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

  const renderLoggedInContent = () => {
    const menuSections = [
      {
        title: "Account",
        items: [
          {
            leftIcon: theme === "dark" ? "person" : "person-outline",
            rightIcon: "chevron-forward",
            label: i18n.t("profile.editProfile"),
            selectedValue: "",
            onValueChange: () => router.push("/(tabs)/(profile)/editProfile"),
          },
        ],
      },
      {
        title: "Preferences",
        items: [
          {
            leftIcon: theme === "dark" ? "language" : "language-outline",
            rightIcon: "chevron-forward",
            label: i18n.t("profile.chooseLanguage"),
            selectedValue: i18n.t("profile.locale"),
            onValueChange: () => handleLanguageChange(locale),
          },
          {
            leftIcon: theme === "dark" ? "wallet" : "wallet-outline",
            rightIcon: "chevron-forward",
            label: i18n.t("profile.chooseCurrency"),
            selectedValue: selectedCurrency,
            onValueChange: () => setCurrencyModalVisible(true),
          },
          {
            leftIcon: theme === "dark" ? "moon" : "sunny",
            rightIcon: "chevron-forward",
            label: i18n.t("profile.chooseAppearance"),
            selectedValue: i18n.t(
              theme === "dark" ? "profile.dark" : "profile.light"
            ),
            onValueChange: toggleTheme,
          },
        ],
      },
      {
        title: "Legal",
        items: [
          {
            leftIcon: theme === "dark" ? "book" : "book-outline",
            rightIcon: "chevron-forward",
            label: i18n.t("legal.title"),
            selectedValue: "",
            onValueChange: () => router.push("/(tabs)/(legal)/legal"),
          },
        ],
      },
      {
        title: "Help & Support",
        items: [
          {
            leftIcon: theme === "dark" ? "help-circle" : "help-circle-outline",
            rightIcon: "chevron-forward",
            label: i18n.t("faq.title"),
            selectedValue: "",
            onValueChange: () => router.push("/(tabs)/(profile)/faq"),
          },
          {
            leftIcon:
              theme === "dark"
                ? "information-circle"
                : "information-circle-outline",
            rightIcon: "chevron-forward",
            label: i18n.t("about.title"),
            selectedValue: "",
            onValueChange: () => router.push("/(tabs)/(profile)/about"),
          },
          {
            leftIcon: theme === "dark" ? "help-buoy" : "help-buoy-outline",
            rightIcon: "chevron-forward",
            label: i18n.t("help.title"),
            selectedValue: "",
            onValueChange: () => router.push("/(tabs)/(profile)/help"),
          },
        ],
      },
      {
        title: "Account",
        items: [
          {
            leftIcon: theme === "dark" ? "log-out" : "log-out-outline",
            rightIcon: "chevron-forward",
            label: i18n.t("auth.logout"),
            selectedValue: "",
            onValueChange: handleLogout,
          },
        ],
      },
    ];

    return (
      <ThemedView style={{ flex: 1 }}>
        <ThemedView className="w-full items-center pt-5">
          <ProfileAvatar
            imageUri={
              user?.user_metadata?.avatar_url ||
              "https://via.placeholder.com/100"
            }
            name={user?.user_metadata?.full_name || "User"}
            email={user?.email || ""}
          />
        </ThemedView>
        <ScrollView className="mt-6 w-full flex-1">
          {menuSections.map((section, sectionIndex) => (
            <ThemedView
              key={sectionIndex}
            >
              <ThemedText
                className="px-4 py-2 text-sm font-bold"
                style={{
                  color: getColor("gray"),
                  backgroundColor: getColor("background"),
                }}
              >
                {section.title}
              </ThemedText>
              <ThemedView
              key={sectionIndex}
              className="mb-4 mx-4 rounded-lg overflow-hidden"
              style={{
                backgroundColor: getColor("surface"),
                shadowColor: getColor("text"),
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              {section.items.map((item, itemIndex) => (
                <ThemedView key={itemIndex} className={`${itemIndex !== section.items.length - 1 ? 'border-b border-gray-200' : ''}`} style={{
                  backgroundColor: getColor("surface"),
                }}>
                  <ProfileListElement
                    key={itemIndex}
                  leftIcon={item.leftIcon as any}
                  rightIcon={item.rightIcon as any}
                  label={item.label}
                  selectedValue={item.selectedValue}
                  onValueChange={item.onValueChange}
                  />
                </ThemedView>
              ))}
            </ThemedView>
            </ThemedView>
          ))}
        </ScrollView>
      </ThemedView>
    );
  };

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
          onRegister={(data) => handleRegister(data as any)}
          onLogin={(data) => handleLogin(data as any)}
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

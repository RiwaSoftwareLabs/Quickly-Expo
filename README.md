# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Clone the repository:

   ```bash
   git clone https://github.com/RiwaSoftwareLabs/Quickly-Expo.git
   ```

2. Navigate to the project directory:

   ```bash
   cd megadeals-mobile
   ```

3. Install dependencies:

   ```bash
   yarn install
   ```

4. Start the app:

   ```bash
   yarn start
   ```

## Take a Build

1. Install the EAS CLI globally:

   ```bash
   npm install -g eas-cli
   ```

2. Log in with your Expo account:

   ```bash
   eas login
   ```

3. Configure your project for EAS Build:

   ```bash
   eas build:configure
   ```

4. Build for Android Emulator/device or iOS Simulator:

- [For Android build:]

  ```bash
  eas build --platform android
  ```

- [For iOS build:]

  ```bash
  eas build --platform ios
  ```

## Upload to Store

1. Configure EAS Submit with eas.json

2. Upload to the Google Play Store:

   ```bash
   eas submit --platform android
   ```

3. Submit the binary to the App Store:

   ```bash
   eas submit -p ios
   ```

## Learn More

To learn more about developing your project with Expo, check out these resources:

- **[Expo Documentation](https://docs.expo.dev/)**: Learn the fundamentals or explore advanced topics with our guides.
- **[Learn Expo Tutorial](https://docs.expo.dev/tutorial/introduction/)**: Follow a step-by-step tutorial to create a project that runs on Android, iOS, and the web.

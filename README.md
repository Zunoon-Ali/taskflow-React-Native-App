This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

---

# 📚 Learning Guides & Viva Preparation

Aapki learning aur viva ki behtareen tayari ke liye niche detailed guides banayi gayi hain. Inhe click kar ke read karein:

1. **[📱 React Native Setup & Commands Guide](file:///e:/MyProjects/ReactNative-Ai/tasskflowRN/docs/01_react_native_setup.md)**
   - Dependencies download links (Node, JDK, Android Studio) aur environment variable configuration.
   - Run Android, Start Metro bundler, Doctor, Audit, aur Clean cache commands ka table.

2. **[📘 TypeScript Syntax & Type Definitions Guide](file:///e:/MyProjects/ReactNative-Ai/tasskflowRN/docs/02_typescript_syntax.md)**
   - Basic TS syntax, Interface vs Type, generic `ApiResponse<T>`, custom component types, aur React Navigation stack param lists.

3. **[🧭 Project Architecture & Data Flow Guide](file:///e:/MyProjects/ReactNative-Ai/tasskflowRN/docs/03_project_flow.md)**
   - Folder structure walkthrough, screen navigation paths, data load flow (AsyncStorage -> mock API), aur Flask API/AI fallback mechanics.

4. **[🔌 Mobile Testing & Debugging Guide](file:///e:/MyProjects/ReactNative-Ai/tasskflowRN/docs/04_android_mobile_testing.md)**
   - USB cable debugging configuration on physical Android phone.
   - Virtual Emulator installation, **scrcpy** setup guide for mirroring screen on PC, and Troubleshooting build errors.

5. **[⚖️ React Web vs React Native Differences](file:///e:/MyProjects/ReactNative-Ai/tasskflowRN/docs/05_react_vs_react_native.md)**
   - HTML tags mapping to Native components (e.g. `div` -> `View`, `p` -> `Text`).
   - Styling differences (`StyleSheet` properties camelCase, no unit values) and Flexbox layout defaults.

6. **[🎓 Viva & Technical Interview Prep](file:///e:/MyProjects/ReactNative-Ai/tasskflowRN/docs/06_viva_preparation.md)**
   - Frequently asked questions (FAQs) with detailed Roman Urdu and English answers.
   - In-depth logic explanations of React Context API, Custom Hooks, TanStack Query, and IP port configurations (10.0.2.2 vs localhost).

---

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

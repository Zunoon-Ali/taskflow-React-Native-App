# Project Execution & Troubleshooting Guide

This guide contains run commands, system check commands, and diagnostic solutions to ensure smooth execution of the React Native application.

---

## 1. Project Execution Commands

Execute these commands from your project root directory:

### Step 1: Start Metro Bundler
Metro is the JavaScript compiler for React Native. Keep this terminal window open during development.
```bash
npm start
# or
npx react-native start
```

### Step 2: Build and Run Android
Open a new terminal window and run:
```bash
npm run android
# or
npx react-native run-android
```

### Target a Specific Connected Device
To run on a specific mobile phone when multiple emulators or devices are active:
1. List active devices:
   ```bash
   adb devices
   ```
2. Run on target device:
   ```bash
   npx react-native run-android --deviceId <YOUR_DEVICE_SERIAL_NUMBER>
   ```

---

## 2. Diagnostics & Verification Commands

### Check Connected Devices
Verify that ADB registers your connected phone:
```bash
adb devices
```
*If list is empty, verify USB Debugging settings and PC connection authorization on your phone.*

### Verify Environment Health
Runs react-native doctor to scan and fix configuration errors (Android SDK, Java Home, Android Studio, etc.):
```bash
npx react-native doctor
```

### Read Runtime Logcat Logs
Inspect app console outputs, network request failures, or JS runtime exceptions:
```bash
adb logcat -d --pid=$(adb shell pidof -s com.taskflowrn)
```

### Port Forwarding Setup
Ensures the app on your physical mobile phone can reach Metro bundler (localhost:8081) on your PC:
```bash
adb reverse tcp:8081 tcp:8081
```

---

## 3. Cache Clearing & Clean Resets

If you encounter unexpected build errors, compilation crashes, or outdated package modules, execute these commands to perform a clean reset:

### Reset Metro Transform Cache
Clears the Metro compiler cache and restarts the dev server:
```bash
npx react-native start --reset-cache
```

### Clean Gradle Build Cache
Deletes previous Android build compilations and forces a fresh compile:
```bash
cd android
./gradlew clean
cd ..
```
*(Windows users can run `./gradlew.bat clean` or `gradlew clean` from inside the `android` folder).*

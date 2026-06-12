# React Native Setup & Initialization Guide

This guide covers the prerequisites, installation steps, and environment configuration required to set up and run a React Native application.

---

## 1. Prerequisites (Before Starting)

Before initializing or running a React Native project, you must install the following software:

### Node.js (JavaScript Runtime)
* **Purpose:** Runs build tools, package manager commands, and compiles JavaScript/TypeScript code.
* **Download:** Install the LTS version from [Node.js Official Website](https://nodejs.org/).
* **Verification:** Run `node -v` and `npm -v` in your terminal.

### JDK 17 (Java Development Kit)
* **Purpose:** Compiles native Java/Kotlin code for the Android application wrapper.
* **Download:** Install Eclipse Temurin JDK 17 from [Adoptium Website](https://adoptium.net/).
* **Verification:** Run `javac -version` in your terminal.

### Android Studio (SDK & Emulator)
* **Purpose:** Provides the Android SDK (build tools, platforms) and Virtual Device manager.
* **Download:** Install from [Android Studio Website](https://developer.android.com/studio).
* **Configuration:**
  1. Open Android Studio and navigate to **SDK Manager** (Settings > Languages & Frameworks > Android SDK).
  2. Under the **SDK Platforms** tab, ensure `Android 15 (VanillaIceCream)` or `Android 14 (UpsideDownCake)` is selected.
  3. Under the **SDK Tools** tab, install:
     - `Android SDK Build-Tools`
     - `Android SDK Command-line Tools (latest)`
     - `Android Emulator`
     - `Android SDK Platform-Tools`

---

## 2. Environment Variables Setup (Windows)

To allow React Native and ADB to execute builds globally, set up your system environment paths:

1. Search for **"Edit the system environment variables"** in the Windows Start menu.
2. Click **Environment Variables...**.
3. Under **User variables**, click **New...**:
   * **Variable name:** `ANDROID_HOME`
   * **Variable value:** `C:\Users\<Your_Username>\AppData\Local\Android\Sdk` (Replace `<Your_Username>` with your Windows login name).
4. Under **User variables**, select the **Path** variable and click **Edit**. Add these new entry lines:
   * `%ANDROID_HOME%\platform-tools`
   * `%ANDROID_HOME%\emulator`
5. Restart your terminal or command prompt for changes to take effect.

---

## 3. Physical Device Testing (USB Debugging)

To run the application directly on your connected mobile phone:

1. **Enable Developer Options:** Go to phone **Settings** > **About Phone** > Tap **Build Number** 7 times continuously until it indicates "Developer mode enabled".
2. **Enable USB Debugging:** Open phone **Settings** > **System** > **Developer Options** > Turn on **USB Debugging**.
3. **Change USB Connection Mode:** Connect the phone to the computer via USB cable. Pull down your notification panel, select USB Settings, and set the mode to **File Transfer (MTP)** or **MIDI**.
4. **Authorize PC Connection:** A prompt will appear on your phone screen asking to allow USB Debugging. Check **"Always allow from this computer"** and click **OK**.

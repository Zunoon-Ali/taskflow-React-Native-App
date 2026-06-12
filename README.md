# TaskFlow - Student Task Manager App

TaskFlow is a premium, feature-rich hybrid mobile application built with **React Native (CLI)**, **TypeScript**, and **Google Gemini AI**. It is designed to help college students manage their academic workloads, prioritize tasks, and receive personalized emotional mood analysis and coaching.

Developed for the **BSCS-6D Academic Evaluation (SZABIST Karachi)**.

---

## 🚀 App Overview & How It Works

### 1. Secure Authentication & Session Persistence
* **Login Screen**: Students can log in using custom credentials. Includes an **Autofill Demo Credentials** button for quick assessment and a toggle to show/hide the password.
* **Session Storage**: User session status is saved locally in **AsyncStorage**. When the app starts, it checks if a session exists and automatically redirects the student to the dashboard (no login required again).
* **Logout Screen**: Logs the user out and wipes credentials from storage.

### 2. Task Dashboard (CRUD & Sorting)
* **API Fetching**: On first launch, the app pulls sample tasks from `JSONPlaceholder` to populate the list.
* **Local Persistence**: All new tasks, completions, and deletions are saved in **AsyncStorage**, meaning data is preserved across app relaunches.
* **Search & Filters**: Real-time searching allows filtering tasks by title instantly.
* **Priority Classification**: Every task has a dynamic priority level (`HIGH` in red, `MEDIUM` in blue, `LOW` in green).
* **Interactive Toggles**: Mark tasks complete with custom animations, struck-through titles, or delete them instantly.

### 3. Google Gemini AI Integration
* **Dynamic Task Descriptions**: When viewing a task, Google Gemini AI generates a short, professional, action-oriented description to help students understand how to tackle it.
* **AI Coach & Mood Analyzer**: Located on the **AI Coach** screen. Students write how they feel (e.g., *"I have 3 exams tomorrow and I am stressed"*). Gemini analyzes the input, detects the emotional mood (`Stressed`, `Happy`, `Tired`, `Neutral`), and generates personalized academic coaching advice.
* **Offline Graceful Fallback**: If no internet is available or the API key fails/is missing, the app automatically runs a built-in offline analysis engine (fallback) using local keywords to provide immediate advice without displaying annoying crash screens.

---

## 📋 Evaluation Checklist: Expected Outputs to Demonstrate
To show the evaluator how the app functions, record or present these steps:
1. **Initial Boot & Login Screen**:
   - Tap **Autofill Credentials** to instantly fill in `student@szabist.edu.pk` and `admin123`.
   - Tap the **Eye Icon** to show/hide the password.
   - Tap **Login** to enter.
2. **Dashboard Actions**:
   - Search for a task in the **Search Bar**.
   - Mark a task complete (watch the struck-through text and completion checkmark).
   - Delete a task.
   - Add a new task: Type a title, set the priority to HIGH/MEDIUM/LOW, and tap **+ Add Task**.
3. **AI Coach Screen**:
   - Tap the **AI Coach** button.
   - Enter: *"I have a presentation tomorrow and feel nervous."*
   - Tap **Get AI Motivation** to view the analyzed mood status and custom advice.
4. **Theme Toggling**:
   - Toggle the theme switch on the header to shift the UI between a sleek Light mode and Dark mode instantly.
5. **Session Persistence**:
   - Close the app entirely from the emulator/device task manager.
   - Open the app again; notice that it skips the Login screen and opens directly to the Dashboard with your tasks saved.
   - Tap **Logout** to test redirecting back to the login page.

---

## 💻 Cloning on a Friend's PC (Common Errors & Solutions)

Since you don't have your own laptop, you will need to clone the repo on your friend's PC for the evaluation. Below are the **exact errors you will encounter** and how to solve them:

### ⚠️ Error 1: Gradle Build Failure or Compilation Mismatch
* **Why it happens**: Cached files from the previous Windows build machine conflict with the new machine.
* **Solution**: Clean the Gradle cache before building:
  ```powershell
  # Go into the android folder and clean
  cd android
  ./gradlew clean
  cd ..
  
  # Run the app targeting active architecture only
  npx react-native run-android --active-arch-only
  ```

### ⚠️ Error 2: `Unable to resolve "@env"` or Gemini SDK Fails
* **Why it happens**: The `.env` file containing your API keys is **ignored by Git** (via `.gitignore`) for security. When you clone on a new PC, the `.env` file does not exist.
* **Solution**:
  1. Create a new file named `.env` at the root directory of the project.
  2. Paste your Gemini API key inside it:
     ```env
     GEMINI_API_KEY=YOUR_ACTUAL_GEMINI_API_KEY_HERE
     ```
  3. Reset the Metro transformer cache:
     ```powershell
     npx react-native start --reset-cache
     ```

### ⚠️ Error 3: "Android SDK not found" or "SDK location not found"
* **Why it happens**: Your friend's computer has the Android SDK installed in a different path or has not set the environment variable.
* **Solution**:
  1. Open Windows Search, type **Edit the system environment variables**, and open it.
  2. Click **Environment Variables**.
  3. Under **User variables**, click **New** and add:
     - Variable name: `ANDROID_HOME`
     - Variable value: `C:\Users\<Friend_Username>\AppData\Local\Android\Sdk`
  4. Select the **Path** variable, click **Edit**, and add these two lines:
     - `%ANDROID_HOME%\platform-tools`
     - `%ANDROID_HOME%\emulator`
  5. Close all terminals and reopen them for the changes to apply.

### ⚠️ Error 4: "Another process is running on port 8081"
* **Why it happens**: A background node process or a previous Metro session is occupying port 8081.
* **Solution**:
  1. Kill the process occupying port 8081:
     ```powershell
     # Find and kill the process on port 8081 (Windows PowerShell)
     Stop-Process -Id (Get-NetTCPConnection -LocalPort 8081).OwningProcess -Force
     ```
  2. Or, if asked `Use port 8082 instead? [Y/N]`, press **Yes** and run:
     ```powershell
     adb reverse tcp:8081 tcp:8082
     ```

### ⚠️ Error 5: "No devices or emulators found"
* **Why it happens**: The Android Emulator is closed, or USB Debugging is disabled on the connected phone.
* **Solution**:
  1. Open Android Studio -> Device Manager -> Start your Emulator.
  2. Alternatively, run:
     ```powershell
     adb devices
     ```
     to ensure your device is listed under `List of devices attached`.

---

## 🛠️ Step-by-Step Setup Guide

Follow these commands to set up the project on your friend's PC:

### 1. Install Dependencies
Run this in the project root:
```powershell
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory and add a valid Google Gemini API Key:
```env
GEMINI_API_KEY=AIzaSy...
```
*(You can generate a free API key at [Google AI Studio](https://aistudio.google.com/)).*

### 3. Run Metro Bundler
Start the packager in its own terminal:
```powershell
npm start
```

### 4. Launch App on Android Emulator
Open a separate terminal window and run:
```powershell
npm run android
```

---

## 📚 Technical Documentation Directory

For deep architectural and technical analysis, refer to:
1. [Prerequisites & System Setup Guide](file:///f:/reactNative/docs/01_react_native_setup.md)
2. [Screen Design & Functional Specs](file:///f:/reactNative/docs/02_react_project_functionality.md)
3. [Full CLI Commands & Diagnostics](file:///f:/reactNative/docs/03_run_and_troubleshoot.md)
4. [Gemini AI Setup & Prompt Structure](file:///f:/reactNative/docs/04_gemini_integration.md)
5. [AsyncStorage & Session Managers](file:///f:/reactNative/docs/05_async_storage.md)

---
*SZABIST Karachi · BSCS - 6D · 2026*

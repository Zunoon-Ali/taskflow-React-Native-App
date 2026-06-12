# 📚 TaskFlow Project Documentation Index

Welcome to the official documentation directory for the **TaskFlow** mobile application. This directory holds step-by-step guides covering React Native setup, app flows, Gemini AI chatbot integration, and local storage state persistence.

---

## 🗂️ Documentation Guides

Select a guide below to explore technical implementation details:

1. **[📱 React Native Setup & Prerequisites Guide](file:///f:/reactNative/docs/01_react_native_setup.md)**
   - Pre-initialization software requirements (Node.js, JDK 17, Android Studio SDKs & Build tools).
   - System Environment variable settings for Windows (`ANDROID_HOME`, platform-tools, emulator paths).
   - USB Debugging configurations to test the app on physical mobile devices.

2. **[🧭 Screen Designs & App Functionality Guide](file:///f:/reactNative/docs/02_react_project_functionality.md)**
   - Overview of the academic project details, section, and developers (BSCS-6D, SZABIST Karachi).
   - Breakdown of the four core screens: Login, Home, Task Details, and AI Coach.
   - Screen functionality checklist (Autofill, Show/Hide Password, Username clean display, Task CRUD).

3. **[⚙️ Execution & Troubleshooting Reference](file:///f:/reactNative/docs/03_run_and_troubleshoot.md)**
   - Commands to start Metro, compile the Android build, or target specific devices.
   - Diagnosing environmental issues via ADB checks, doctor scans, port forwarding, and log inspection.
   - Resetting transformer cache and cleaning Gradle caches.

4. **[🤖 Gemini AI Integration Guide](file:///f:/reactNative/docs/04_gemini_integration.md)**
   - Connecting directly to Google's Gemini SDK (`@google/generative-ai`) inside a React Native project.
   - Configuring Babel plugins (`react-native-dotenv`) and typings (`env.d.ts`) to secure API key secrets.
   - Wrapper hooks for React Query mutations (`useAiDescription` and `useAiMotivation`).

5. **[🔌 AsyncStorage Persistence Guide](file:///f:/reactNative/docs/05_async_storage.md)**
   - Background information on mobile storage and package bindings.
   - Storing the global tasks state, complete list updates, and fetching fallback data from JSONPlaceholder.
   - User authentication session storage, checking saved login on app startup, and removing session keys upon logout.

---

*SZABIST Karachi · BSCS - 6D · 2026*

# 📱 React Native Environment Setup & Commands Guide

Yeh guide aapko React Native CLI ke environment setup karne, dependencies install karne, aur essential commands seekhne mein help karegi.

---

## 🛠️ Required Dependencies & Downloads

React Native CLI par app chalane ke liye 4 main tools chahiye hote hain. Unhe kahan se aur kaise download karna hai, niche bataya gaya hai:

### 1. Node.js (JavaScript Runtime)
* **Kyun chahiye?** React Native code JavaScript/TypeScript mein hota hai. Isko run aur build karne ke liye Node.js chahiye hota hai.
* **Kahan se download karein?** [Node.js Official Website](https://nodejs.org/) (Recommended: **LTS Version** e.g., 20.x or 22.x).
* **Verify installation:** Terminal (cmd/powershell) mein run karein:
  ```bash
  node -v
  npm -v
  ```

### 2. JDK (Java Development Kit)
* **Kyun chahiye?** Android apps build karne ke liye Java zaroori hai. React Native ke liye **JDK 17** recommended hai.
* **Kahan se download karein?** [Adoptium Temurin OpenJDK 17](https://adoptium.net/temurin/releases/?version=17) ya Oracle JDK 17 download karein.
* **Verify installation:** Terminal mein run karein:
  ```bash
  javac -version
  ```

### 3. Android Studio (Android SDK & Emulator)
* **Kyun chahiye?** Android Simulator (Emulator) aur SDK (build tools) ke liye iski zaroori hoti hai.
* **Kahan se download karein?** [Android Studio Official Website](https://developer.android.com/studio).
* **Setup Steps:**
  1. Android Studio install karein aur run karein.
  2. Setup Wizard ke dauran **Android SDK**, **Android SDK Platform**, aur **Android Virtual Device** (Emulator) select karke download hone dein.
  3. **SDK Manager** open karein (Settings > Languages & Frameworks > Android SDK) aur:
     - Check karein ke `Android 14 (Upside Down Cake)` ya latest SDK installed hai.
     - "SDK Tools" tab mein ja kar check karein ke `Android SDK Build-Tools` aur `Android SDK Command-line Tools` installed hain.

### 4. Environment Variables Setup (Windows ke liye)
Android SDK ko commands ke sath access karne ke liye system ko batana padta hai ke SDK kahan install hai.
1. Windows Start Menu mein search karein **"Edit the system environment variables"**.
2. **Environment Variables** button par click karein.
3. **User variables** mein click karein **New...** aur add karein:
   - **Variable name:** `ANDROID_HOME`
   - **Variable value:** `C:\Users\<Aapka_Username>\AppData\Local\Android\Sdk`
4. **Path** variable ko select karke **Edit** karein aur new lines add karein:
   - `%ANDROID_HOME%\platform-tools`
   - `%ANDROID_HOME%\emulator`

---

## 🚀 CLI Commands Reference Cheat Sheet

Aapke React Native project ke root folder (`e:\MyProjects\ReactNative-Ai\tasskflowRN`) mein terminal se run hone wali important commands:

| Command | Purpose / Kaam | Kab Use Hoti Hai? |
| :--- | :--- | :--- |
| `npm install` (or `npm i`) | Sabhi external library/dependencies ko download aur local node_modules folder mein install karta hai. | Jab pehli baar code copy karein ya package.json change ho. |
| `npm start` (or `npx react-native start`) | **Metro Bundler** start karta hai. Yeh JS code ko real-time compiler ki tarah pack karta hai. | Hamesha app run karne se pehle ise doosre terminal par open rakhna padta hai. |
| `npm run android` (or `npx react-native run-android`) | App ko build karke connected phone/emulator par install aur run karta hai. | Jab app ko pehli baar chalana ho ya native code tabdeel kiya ho. |
| `npx react-native doctor` | Aapke system settings (Node, SDK, JDK, Environment variables) ko scan karke batata hai kya theek hai aur kya missing. | Jab build error aaye ya setup check karna ho. |
| `npm audit` | Project mein use hone wali libraries ke security vulnerabilities (kamzoriyan) check karta hai. | Code production par bhejne se pehle check karne ke liye. |
| `npm audit fix` | Secure versions mein packages ko auto-update karne ki koshish karta hai bina break kiye. | Jab security warnings ko automatically fix karna ho. |
| `npx react-native clean` | Build cache, gradle cache, aur temporary folders ko clear karta hai. | Jab ajeeb errors aayein jo run karne se solve na ho rahe hon (Clean State). |

---

## ⚠️ Common Troubleshooting (Ghaltiyan aur unka hal)

> [!TIP]
> **Error: "ANDROID_HOME is not set"**
> - **Hal:** Aapke system Environment Variables mein `ANDROID_HOME` variable set nahi hai ya galat path hai. Upar diye gaye **Environment Variables Setup** steps ko dobara check karein aur terminal restart karein.

> [!WARNING]
> **Error: "Failed to install the app on the device"**
> - **Hal:** Check karein ke aapka physical mobile USB se sahi se connected hai ya nahi. Terminal par `adb devices` chala kar check karein ke mobile list mein show ho raha hai ya nahi.

> [!NOTE]
> **Metro Screen blank ya loading par stuck ho jaye:**
> - Apne run ho rahe terminal par click karein aur `r` dabayein app ko reload karne ke liye.
> - Ya terminal band kar ke `npm start` dobara chalayein aur mobile par app ko close kar ke open karein.

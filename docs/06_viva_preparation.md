# 🎓 Viva & Technical Interview Preparation Guide

Yeh guide aapko is app (`tasskflowRN`) ke architectural decisions, code logic, state management, aur hooks se related important **Viva/Interview questions** ki taiyari karwayegi.

---

## 💡 Q1: Aapki App ka Overview kya hai aur isme kya core features hain?
* **Jawab (English):** "TaskFlowRN is a smart React Native task management app designed for students. It manages student tasks (add, complete, priority levels) locally, and integrates with a Python Flask server powered by Gemini AI to provide smart task descriptions and a motivational coaching chat. If the Flask server is down, it safely falls back to local pre-defined logic to ensure offline functionality."
* **Jawab (Urdu):** "Yeh ek React Native task management app hai jo students ke liye bani hai. Isme basic task manager ke sath-sath AI capabilities hain, jo Flask backend aur Gemini API se connect ho kar tasks ke suggestions aur student mood motivation details generate karti hai. Agar server online na ho, to local static logic se backup load ho jata hai."

---

## 🔄 Q2: State Management ke liye kya use kiya gaya hai aur kyun?
App mein do tarah ki states hain: **Client-side UI state** aur **Server/Cache State**.

### A. Context API (`src/context/TaskContext.tsx` aur `ThemeContext.tsx`):
* **Sawaal:** Context API kya hai? Aapne ise kyun use kiya?
* **Jawab:** 
  - Context API React ka built-in state management solution hai jo **Props Drilling** se bachata hai. Props Drilling tab hoti hai jab parent component se child ko data bhejne ke liye beech ke har component ko bina zaroorat ke props pass karne parein.
  - Context API se data ko hum ek "global scope" mein store kar dete hain, jise app ka koi bhi component direct consume kar sakta hai.
  - Humne ise **Theme** (Dark/Light mode) aur **Tasks data list** ko dynamic aur globally available rakhne ke liye use kiya.

### B. TanStack Query / React Query:
* **Sawaal:** TanStack Query kya hai aur iski kya zaroorat thi?
* **Jawab:**
  - TanStack Query server data (external backend status/AI responses) ko fetch, cache, aur sync karne ke liye best tool hai.
  - Iske bagair hume `useEffect`, `useState` (for loading, error, data) aur custom refetch coding karni padti.
  - TanStack Query auto-caching, auto-retry, aur auto-refetch control deta hai. Is project mein humne iska use Flask server health aur AI endpoints se response lene ke liye kiya.

---

## 🗄️ Q3: AsyncStorage kya hai? Yeh app mein kya kaam kar raha hai?
* **Sawaal:** AsyncStorage kya hai aur ye kis liye use kiya?
* **Jawab:**
  - **AsyncStorage** React Native ka key-value based asynchronous persistent storage engine hai (bilkul weblink browser ke `localStorage` ki tarah).
  - Mobile app band hone par data save rakhne ke liye iski zaroorat hoti hai.
  - **Flow in app:** App pehli baar load hone par API se default data utha kar AsyncStorage mein save karti hai. Aage jab bhi user task add ya edit karta hai, wo state ke sath-sath AsyncStorage mein save ho jata hai taake app restart hone par bhi data safe rahe.

---

## 🪝 Q4: Custom Hooks kya hote hain? Aapne kaunse use kiye hain?
* **Sawaal:** Custom Hooks aur built-in hooks mein kya farq hai?
* **Jawab:**
  - **Custom Hook** ek simple JavaScript/TypeScript function hota hai jiska naam `use` se shuru hota hai. Yeh multiple components ke beech stateful aur business logic share karne ke liye banaya jata hai.
  - **Hamare Custom Hooks:**
    1. **`useTasks`:** `TaskContext` ko asaan tareeqe se screens mein access karne ke liye use hota hai.
    2. **`useFlaskStatus`:** Flask server ki health check karta hai aur response display karta hai.
    3. **`useAiDescription`:** Task ke text ko le kar smart instructions generate karne ki query mutation karta hai.
    4. **`useAiMotivation`:** User ke feeling input ke base par emotion detection aur motivation retrieve karta hai.

---

## 📡 Q5: Axios Client Setup mein Android aur iOS ke IP address mein farq kyun hai?
* **Sawaal:** `client.ts` mein `android: 'http://10.0.2.2:5000'` aur `ios: 'http://localhost:5000'` kyun set kiya gaya hai?
* **Jawab:**
  - **Android Emulator** ek Virtual Machine ki tarah run hota hai. Iski apni internal network configuration hoti hai. Emulator ke liye `localhost` ka matlab emulator ka apna loopback card hota hai, jahan Flask server running nahi hai.
  - Android emulator ne IP address **`10.0.2.2`** ko host machine (hamare laptop/PC) ke localhost ke loopback ke liye reserve rakha hai.
  - **iOS Simulator** direct host machine ki space share karta hai, isliye wahan `localhost:5000` directly backend se interact kar sakta hai.

---

## 🤖 Q6: AI Backend Offline Fallback system kya hai?
* **Sawaal:** Agar client app Flask server ya Gemini API se connect na ho paye, to app crash kyun nahi karti?
* **Jawab:**
  - Humne hooks (`useAi.ts` aur `useFlaskApi.ts`) mein **Fallback (catch block)** handles banaye hain.
  - Jab API call fail hoti hai, to code error throw karke crash hone ke bajaye offline data render karta hai:
    - *Example (Task Suggestion):* Task title ke keywords check karke (jaise math, biology, history) static helpful study suggestion return ho jata hai.
    - *Example (Coach advice):* Feeling string ke keywords scan hote hain (anxious, lazy, happy) aur offline matching support advice display ho jati hai.

---

## 🧩 Q7: React Navigation Stack workflow kya hai?
* **Sawaal:** App ki screens ek dusre se kaise linked hain?
* **Jawab:**
  - **`App.tsx`** mein navigation stack configure hai. 
  - **`Login`** screen initial screen hai. Jab user name enter karta hai, to `navigation.navigate('Home', { username })` chalta hai aur user ka status name params ke zariye `Home` screen par deliver hota hai.
  - **`Home`** screen se task ID send ki jati hai `TaskDetails` par: `navigation.navigate('TaskDetails', { taskId: item.id })`.
  - Har screen parameter list type check ke liye compile time validation verify karti hai jo `RootStackParamList` interface control karta hai.

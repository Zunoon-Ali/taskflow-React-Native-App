# Project Architecture & Screen Functionality

This document details the screen structures, UI features, and functional flows of the **TaskFlow** application.

---

## 1. Project Specifications

* **Course Project:** Hybrid Mobile Application Development
* **App Name:** TaskFlow (Student Task Manager App)
* **Institution:** SZABIST Karachi, Faculty of Computing & Engineering Sciences
* **Developers:** Waqar Ahmed Shaikh (2312224) & Muhammad Zunoon Ali (2312405)
* **Semester / Section:** BSCS-6D
* **Technology Stack:** React Native CLI, TypeScript, React Navigation (Stack), `@react-native-async-storage/async-storage`, `@tanstack/react-query`, `@google/generative-ai`.

---

## 2. Screen walkthroughs & Features

The application is structured into four main functional screens:

### A. Login Screen (`LoginScreen.tsx`)
* **Purpose:** Handles credential authorization and secure session instantiation.
* **Features:**
  * **Input Fields:** Username/Email and Password text inputs with form validation (checks for empty fields and minimum 4-character passwords).
  * **Autofill Demo Credentials:** A secondary styled button allows quick demo filling of login fields (`student@taskflow.com` and `student123`).
  * **Show/Hide Password:** A text-based toggler ("Show" / "Hide") next to the password input dynamically switches secure input visibility.
  * **Session Persistence:** Saves the username to local storage upon login and checks for an active session during `useEffect` on app startup to bypass the login screen.

### B. Home Screen (`HomeScreen.tsx`)
* **Purpose:** Provides a centralized dashboard to view, search, and manage student tasks.
* **Features:**
  * **Welcome Header:** Displays a dynamic greeting (e.g. `Hello, Student`) extracting only the name part if an email is used to log in, and capitalizing the text.
  * **Logout Action:** A clean "Logout" text button resets the persistent user session and redirects to the login screen.
  * **Task Listing:** Renders tasks dynamically using a `FlatList` with custom card layouts.
  * **Interactive Task Actions:** Checkbox triggers completion toggles, and a red styled "Delete" button removes tasks.
  * **Search Filtering:** An input bar queries tasks in real time.
  * **Flask Server Status:** A badge displays connection status to the Flask backend (standby/online indicators).
  * **AI Coach Launcher:** A shortcut button redirects users to the AI Coach page.
  * **Add Task Panel:** A bottom input field allows rapid creation of new tasks.

### C. Task Details Screen (`TaskDetailsScreen.tsx`)
* **Purpose:** Allows users to view and modify specific attributes of a task.
* **Features:**
  * **Task Title Modification:** Text input allows modifying task headers.
  * **Priority Selector:** A styled button group allows assigning task priority levels (`LOW`, `MEDIUM`, `HIGH`).
  * **Status Toggler:** Choice selectors to toggle task completion between `Pending` and `Complete`.
  * **Generate AI Description:** Leverages the Gemini API to analyze the task title and write a professional 2-3 sentence task description.
  * **Save Handler:** Updates changes back to the global state and navigates back to the main list.

### D. AI Coach Screen (`AICoachScreen.tsx`)
* **Purpose:** Acts as a mental wellness and motivation coach for academic challenges.
* **Features:**
  * **Feeling Input Field:** Multi-line text field where students can write their academic struggles or anxiety.
  * **GET AI MOTIVATION:** Calls the Gemini API to analyze user feelings, categories emotional mood (`Stressed`, `Happy`, `Tired`, `Neutral`), and writes customized coaching advice.
  * **Motivated Advice Card:** Displays the analyzed mood and the coach's recommendation.

# 📘 TypeScript Syntax & Type Definitions Guide (Beginner Friendly)

TypeScript kya hai? TypeScript simple JavaScript ka ek "upgrade" (superset) hai jo code ko **types** (qism) deta hai. Isse faida ye hota hai ke hum run-time errors se bach jate hain kyunki compile-time par hi pata chal jata hai ke hum galat data pass kar rahe hain.

Is guide mein hum TypeScript ke concepts ko simple Urdu/English mix mein samjhenge aur dekhenge ke is project (`tasskflowRN`) mein ye kahan aur kyun use ho rahe hain.

---

## 🔑 Core Concepts in TypeScript

### 1. Type Annotation (Basic Types)
JavaScript mein variables mein koi bhi value daal sakte hain, lekin TypeScript mein hum specify karte hain ke iski type kya hogi:
```typescript
let username: string = "Zunoon";
let taskCount: number = 5;
let isCompleted: boolean = false;
```
*Agar aap `taskCount = "five"` likhenge, to editor fauran laal line (error) dikha dega.*

### 2. Interfaces vs Types
Dono ka maqsad objects ke structure ko batana hota hai, lekin in mein thoda sa farq hai:

* **Interface:** Zyada tar Objects ke shapes describe karne ke liye use hota hai (extend ho sakta hai).
* **Type:** Objects ke sath-sath simple values ke group (Unions) ke liye behtareen hai.

#### **A. Interface Example (Hamare Project se):**
`src/types/index.ts` mein:
```typescript
export interface Task {
  id: string;          // Unique text id
  title: string;       // Task ka naam
  priority: 'LOW' | 'MEDIUM' | 'HIGH'; // Sirf in teeno mein se koi ek string
  completed: boolean;  // true ya false status
  description?: string; // "?" ka matlab optional hai (dena zaroor nahi hai)
}
```

#### **B. Type Union Example (Hamare Project se):**
```typescript
export type Theme = 'light' | 'dark'; // Theme sirf 'light' ya 'dark' hi ho sakta hai
```

---

## 📦 React Special TypeScript Types

Jab React/React Native ke sath TypeScript use karte hain, to kuch special react-specific types use hoti hain:

### 1. `React.JSX.Element`
Functional components jo JSX return karte hain, unka return type `React.JSX.Element` hota hai.
* **Example (`App.tsx` mein):**
  ```typescript
  function App(): React.JSX.Element {
    return <SafeAreaProvider>...</SafeAreaProvider>;
  }
  ```

### 2. `React.ReactNode`
Yeh sabse broad React type hai. Iska matlab hai: "Kuch bhi jo render ho sake" (strings, numbers, simple JSX elements, arrays, etc.).
* **Example (`src/types/index.ts` - `SafeAreaLayoutProps`):**
  ```typescript
  export interface SafeAreaLayoutProps {
    children: React.ReactNode; // Component ke andar aane wala saara content
  }
  ```

### 3. `React.FC<Props>`
`FC` ka matlab hai **Functional Component**. Yeh component ko type dene ke liye use hota hai.
* **Example (`src/AppProvider.tsx` mein):**
  ```typescript
  export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    return <QueryClientProvider client={queryClient}>...</QueryClientProvider>;
  };
  ```

---

## 🚀 Advanced TypeScript Features (Hamare Project mein)

### 1. Generics (`ApiResponse<T>`)
Generics ka matlab hai "Type as a Parameter". Hum type ko flexibile banate hain taake woh alag alag objects ke liye reuse ho sake.

`src/types/index.ts` mein:
```typescript
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T; // T dynamic hai — jo type specify karein, data us type ka ho jayega
}
```

#### **Kahan aur kaise use hota hai?**
Agar hum Flask backend se `ServerStatus` mangwayein:
```typescript
const response: ApiResponse<ServerStatus> = {
  success: true,
  data: {
    status: "ok",
    message: "Server chal raha hai",
    version: "1.0.0"
  }
};
```
Yahan `data` variable automatically `ServerStatus` type ka ban gaya. Humein alag se `ServerStatusResponse` interface nahi banana para!

### 2. Navigation Typing (`RootStackParamList`)
React Navigation mein kis screen par kya data ja sakta hai, use strict banane ke liye hum type use karte hain.

`src/types/index.ts` mein:
```typescript
export type RootStackParamList = {
  Login: undefined;            // Login screen pe koi data pass nahi hoga
  Home: { username: string };  // Home screen par user ka name zaroor chahiye
  TaskDetails: { taskId: string }; // Details screen ke liye taskId zaroor chahiye
  AICoach: undefined;
};
```
Isse screen ke darmiyan wrong data ya parameters pass karne par compiler error de deta hai, jo crash hone se bachata hai.

---

## 💡 Quick Tips for Beginners

1. **`?:` (Optional operator):** Agar kisi interface property ke aage `?` laga hai, iska matlab hai agar wo property missing bhi ho tab bhi code chalega (e.g. `description?: string`).
2. **Union Types (`'LOW' | 'MEDIUM' | 'HIGH'`):** Iska matlab hai in teeno strings ke ilawa koi chauthi string set nahi ki ja sakti. Isse typos (spelling mistakes) nahi hoti.
3. **No implicitly `any`:** Koshish karein variables ko `any` type na dein, warna TypeScript ka faida khatam ho jata hai. Hamesha specific interface ya type assign karein.

// =============================================================================
// FILE: src/types/index.ts
// -----------------------------------------------------------------------------
// Yeh file kya hai?
//   Is poori app ka "vocabulary" — matlab jitni bhi cheezein hum data ke tor
//   par use karte hain, unki "shape" yahan describe ki gayi hai.
//
// Kyun alag file?
//   Agar har jagah apni-apni types likho, to code messy hota hai. Ek jagah
//   sab types rakhne se easy update hoti hain aur koi confusion nahi hoti.
//
// TypeScript mein "interface" kya hota hai?
//   Samjho ek form ki tarah — form mein fields hote hain jaise naam, umra etc.
//   Interface bhi yehi karta hai: batata hai ke kisi object mein kya kya hona
//   chahiye aur kaunse type ka hona chahiye (string, number, etc.)
// =============================================================================

// -----------------------------------------------------------------------------
// CARD COMPONENT KI PROPS (properties)
// -----------------------------------------------------------------------------
// Yeh interface Card component ko batata hai ke usse kya kya data milega.
// Baaki code jo Card use kare, use yahi data dena hoga — kuch bhi alag nahi.

export interface CardProps {
  // Card ka heading / title — yeh zaroor dena hoga (required)
  title: string;

  // Thoda detail — description bhi required hai
  description: string;

  // Badge pe jo text dikhana hai jaise "Standby", "Connected" — optional hai
  // "?" matlab yeh dena zaroor nahi hai, nahi diya to bhi chalega
  status?: string;

  // Badge ka piche wala background color — optional, default blue hai
  // agar nahi diya to apne aap '#3B82F6' (blue) use hoga
  badgeColor?: string;
}

// -----------------------------------------------------------------------------
// FLASK SERVER SE JO DATA AATA HAI USKI SHAPE
// -----------------------------------------------------------------------------
// Jab hum Flask backend se response lete hain, wo ek JSON object hoga.
// Yeh interface batata hai ke us JSON mein exactly kya kya fields honge.
// Agar Flask ne kuch aur bheja, TypeScript hume error dega — wah safety!

export interface ServerStatus {
  // Server theek hai ya nahi — jaise "ok", "error", "Standby"
  status: string;

  // Human-readable message — "Server is running!" wali type
  message: string;

  // API ka version number — jaise "v1.0.0"
  version: string;
}

// -----------------------------------------------------------------------------
// LAYOUT COMPONENT KI PROPS
// -----------------------------------------------------------------------------
// Humara SafeAreaLayout component children wrap karta hai (jaise HTML div).
// Yahan "children" React ka special prop hai — matlab jo bhi andar likha ho
// wo is component ko mil jata hai.

export interface SafeAreaLayoutProps {
  // "React.ReactNode" ek generic type hai React ka — iska matlab hai:
  // "koi bhi React element ya text daal sakte ho andar"
  // Jaise: <SafeAreaLayout><Text>Hello</Text></SafeAreaLayout>
  //                          ^^^^^^^^^^^^^^^^^ yeh "children" hai
  children: React.ReactNode;
}

// -----------------------------------------------------------------------------
// APP PROVIDER KI PROPS
// -----------------------------------------------------------------------------
// AppProvider bhi ek wrapper hai — puri app ko wrap karta hai.
// Iski bhi same children prop ki zaroorat hai.

export interface AppProviderProps {
  children: React.ReactNode;
}

// -----------------------------------------------------------------------------
// GENERIC API RESPONSE TYPE
// -----------------------------------------------------------------------------
// "Generic" TypeScript ka ek advanced feature hai.
// Socho ek dabba hai jisme kuch bhi rakh sakte ho.
//
// ApiResponse<T> ka matlab: API se jo bhi data aaye (T ki jagah),
// uske saath yeh extra fields bhi hongi: success, message, aur data.
//
// T = "Type variable" — caller decide karta hai T kya hai.
// Misal:
//   ApiResponse<ServerStatus>  →  data field mein ServerStatus hoga
//   ApiResponse<string>        →  data field mein simple string hoga
//
// Yeh hume baar baar naya interface banane se bachata hai!

export interface ApiResponse<T> {
  // Kya request successful rahi? true ya false
  success: boolean;

  // Agar error ho to kya message tha — optional
  message?: string;

  // Actual data — T ki jagah jo bhi pass kiya tha woh aayega
  data: T;
}

// -----------------------------------------------------------------------------
// TASK INTERFACE
// -----------------------------------------------------------------------------
// Ek task ka data model (id, title, priority, status etc.)
export interface Task {
  id: string; // Task ki unique ID
  title: string; // Task ka main title
  priority: 'LOW' | 'MEDIUM' | 'HIGH'; // Task ki priority level
  completed: boolean; // Task done hai ya nahi
  description?: string; // Task ki details/suggestion text
  aiSuggestion?: string; // AI se mili hui suggestion
}

// -----------------------------------------------------------------------------
// NAVIGATION PARAMETER LIST
// -----------------------------------------------------------------------------
// App ki screens ke beech navigate karte waqt jo data pass hoga uski typing
export type RootStackParamList = {
  Login: undefined; // Login screen pe koi data pass nahi karna
  Home: { username: string }; // Home screen pe user ka naam pass hoga
  TaskDetails: { taskId: string }; // Details screen pe task ki ID pass hogi
  AICoach: undefined; // AI Coach screen pe koi data pass nahi karna
};

// -----------------------------------------------------------------------------
// THEME TYPE DEFINITIONS
// -----------------------------------------------------------------------------
// App ke themes ke types aur functions jo ThemeContext handle karega
export type Theme = 'light' | 'dark'; // Sirf 'light' ya 'dark' value allow karega
export interface ThemeContextType {
  theme: Theme; // Current active theme
  toggleTheme: () => void; // Theme switch karne ka function
  colors: any; // Theme-specific active colors list
}


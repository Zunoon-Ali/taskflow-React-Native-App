// =============================================================================
// FILE: src/api/client.ts
// -----------------------------------------------------------------------------
// Yeh file kya karti hai?
//   Yeh humari "network connection" file hai — jab bhi app ko internet par
//   kisi server (hamare case mein Flask) se baat karni ho, yeh file use hogi.
//
// "Axios" kya hai?
//   Ek popular JavaScript library hai jo HTTP requests (GET, POST etc.)
//   banane mein help karti hai. Seedha JavaScript mein bhi kar sakte hain
//   lekin Axios zyada easy aur powerful hai.
//
// "HTTP Request" kya hoti hai?
//   Jab app server se kuch maange — jaise "mujhe tasks ki list do" — toh
//   yeh ek HTTP request hoti hai. Server jawab deta hai — response.
// =============================================================================

import axios from 'axios';
import { Platform } from 'react-native';

// -----------------------------------------------------------------------------
// BASEURL LOGIC — server ka pata
// -----------------------------------------------------------------------------
// Yeh thodi tricky cheez hai, samajhna zaroori hai:
//
// Problem:
//   Jab Android Emulator chalti hai, woh ek alag "virtual machine" pe hoti hai.
//   Isliye "localhost" ka matlab emulator ka apna localhost hai — PC ka nahi!
//   Agar hum 'http://localhost:5000' likhen, emulator apne andar dhundega.
//
// Solution:
//   Android Emulator ne '10.0.2.2' address specially reserve kiya hai.
//   Is address ka matlab hai: "PC wala localhost" — yani hamare Flask server ka pata.
//
// iOS simulator mein yeh masla nahi hota — woh directly localhost access kar sakta hai.

const BASE_URL = Platform.select({
  // Android ke liye — 10.0.2.2 = PC ka localhost
  android: 'http://10.0.2.2:5000',

  // iOS ke liye — normal localhost kaam karta hai
  ios: 'http://localhost:5000',

  // Agar web ya kuch aur ho
  default: 'http://localhost:5000',
});

// -----------------------------------------------------------------------------
// AXIOS INSTANCE BANANA
// -----------------------------------------------------------------------------
// axios.create() se hum ek "custom Axios" banate hain jo har request pe
// apne aap yeh settings use karega. Baar baar same options likhne ki zaroorat nahi.

export const apiClient = axios.create({
  // baseURL: har request URL ke aage yeh automatically lag jata hai.
  // Matlab: apiClient.get('/tasks') → actually 'http://10.0.2.2:5000/tasks' banta hai
  baseURL: BASE_URL,

  // timeout: agar 10 second mein server ne jawab nahi diya, request fail ho jaye.
  // 10000 milliseconds = 10 seconds
  timeout: 10000,

  // headers: HTTP headers — server ko batate hain ke hum kaunsa format bhej
  // aur receive karna chahte hain. 'application/json' = JSON format use karo.
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// -----------------------------------------------------------------------------
// REQUEST INTERCEPTOR
// -----------------------------------------------------------------------------
// "Interceptor" ka matlab: beech mein rok lena.
// Yeh code har REQUEST se PEHLE chalta hai — jaise ek "checkpoint" pe ruko.
//
// Yahan hum future mein authentication token add kar sakte hain.
// Jaise: user ne login kiya, token mila — ab har request pe token lagao.
// Abhi ke liye bas request ko as-is aage bhej dete hain.

apiClient.interceptors.request.use(
  async (config) => {
    // Yahan future mein likha ja sakta hai:
    // const token = await AsyncStorage.getItem('userToken');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config; // config ko theek se aage bhejo
  },
  (error) => {
    // Agar request setup mein hi koi error aaye
    return Promise.reject(error);
  }
);

// -----------------------------------------------------------------------------
// RESPONSE INTERCEPTOR
// -----------------------------------------------------------------------------
// Yeh code har RESPONSE aane ke baad chalta hai.
// Success ho toh response seedha de do.
// Error ho toh pehle console pe log karo (debugging ke liye), phir error do.

apiClient.interceptors.response.use(
  (response) => response, // Sab theek hai — seedha response do

  (error) => {
    // Error aaya — console mein print karo taake developer dekh sake
    // '?.' = "optional chaining" — agar response ya data null ho toh crash mat karo
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error); // Error aage propagate karo
  }
);

export default apiClient;

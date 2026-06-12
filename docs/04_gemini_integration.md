# Gemini AI Integration & Configuration Guide

This document explains how Google Gemini API is integrated as an AI Coach (emotional feedback chatbot) and AI task description generator in TaskFlow.

---

## 1. Package Installation

To communicate directly with Google's Gemini models in React Native:
```bash
npm install @google/generative-ai
```

---

## 2. Secure API Key Setup (dotenv)

To prevent pushing sensitive API keys to GitHub repositories, we configure local environment variables using `react-native-dotenv`.

### Step 1: Install dotenv plugin
```bash
npm install react-native-dotenv --save-dev
```

### Step 2: Configure `babel.config.js`
Register the dotenv plugin in your Babel configurations:
```javascript
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
      },
    ],
  ],
};
```

### Step 3: Create Local Environment File (`.env`)
Create a `.env` file at your project root:
```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
```
*Make sure `.env` is listed inside your `.gitignore` to prevent leaking it.*

### Step 4: Add TypeScript Typings (`env.d.ts`)
Create a file at `src/types/env.d.ts` to allow type declarations:
```typescript
declare module '@env' {
  export const GEMINI_API_KEY: string;
}
```

---

## 3. Gemini Client API (`geminiClient.ts`)

The client resides in `src/api/geminiClient.ts`. It initializes the SDK and interacts with **`gemini-2.5-flash`** for quick mobile responses:

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '@env';

const ai = new GoogleGenerativeAI(GEMINI_API_KEY);
```

### A. Task Description Generator
Generates academic task descriptions based on titles:
```typescript
export const getGeminiTaskDescription = async (title: string): Promise<string> => {
  const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const prompt = `As an academic assistant, write a short, professional, action-oriented task description (max 2-3 sentences) for a student task titled: "${title}".`;
  const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }] });
  return result.response.text().trim();
};
```

### B. AI Coaching Advisor (Mood Chatbot)
Analyzes emotional state and outputs structured JSON containing classified mood category and coaching recommendations:
```typescript
export const getGeminiCoachingAdvice = async (feeling: string): Promise<{ mood: string; advice: string }> => {
  const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const prompt = `You are a professional academic coach. Analyze this student's feeling: "${feeling}". Provide response strictly in JSON: {"mood": "Stressed" | "Happy" | "Tired" | "Neutral", "advice": "Motivational coaching advice (max 2 sentences)"}`;
  const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }] });
  const parsed = JSON.parse(result.response.text());
  return parsed;
};
```

---

## 4. Hook Implementations (`useAi.ts`)

We wrap client functions in React Query (`@tanstack/react-query`) mutations inside `src/hooks/useAi.ts` for clean state loading states and cache updates:

```typescript
import { useMutation } from '@tanstack/react-query';
import { getGeminiTaskDescription, getGeminiCoachingAdvice } from '../api/geminiClient';

export const useAiDescription = () => {
  return useMutation<string, Error, string>({
    mutationFn: (title: string) => getGeminiTaskDescription(title),
  });
};

export const useAiMotivation = () => {
  return useMutation<{ mood: string; advice: string }, Error, string>({
    mutationFn: (feeling: string) => getGeminiCoachingAdvice(feeling),
  });
};
```
These hooks expose `isPending` properties, allowing UI views (`AICoachScreen`, `TaskDetailsScreen`) to dynamically show `<ActivityIndicator />` spinners during API request execution.

// =============================================================================
// FILE: src/AppProvider.tsx
// -----------------------------------------------------------------------------
// Yeh file kya karti hai?
//   Yeh poori app ka "wrapper" hai — ek bada container samjho.
//   Puri app is ke andar hoti hai, isliye jo bhi yahan setup hoga
//   wo saari app mein available hoga.
//
// "Provider" pattern kya hai?
//   React mein Provider ek technique hai jo data ya features ko
//   poori app ke har component tak pahunchati hai — bina baar baar
//   props pass kiye. Jaise bijli ka meter ek jagah hota hai lekin
//   poore ghar mein bijli aati hai.
//
// "QueryClientProvider" kya hai?
//   TanStack Query ka Provider. Jab yeh app ke upar ho,
//   toh poori app mein useQuery(), useMutation() jaise hooks kaam karte hain.
// =============================================================================

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Types file se AppProviderProps import kar rahe hain
import { AppProviderProps } from './types';

// -----------------------------------------------------------------------------
// QUERY CLIENT CONFIGURATION
// -----------------------------------------------------------------------------
// "QueryClient" ek object hai jisme TanStack Query ka sara kaam manage hota hai.
// Yeh cache rakhta hai, background refetch manage karta hai, etc.
//
// Yahan hum iske default behavior configure kar rahe hain:

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // retry: agar request fail ho, auto retry karo?
      // 2 matlab: 2 baar dobara try karega fail hone ke baad
      retry: 2,

      // refetchOnWindowFocus: kya jab bhi user app pe wapas aaye, data dobara fetch ho?
      // false rakha hai — zyada unnecessary requests nahi chahiye
      refetchOnWindowFocus: false,

      // staleTime: kitni der tak cached data "fresh" mane?
      // 1000 ms = 1 second
      // 1000 * 60 = 60,000 ms = 1 minute
      // 1000 * 60 * 5 = 300,000 ms = 5 minutes
      // Matlab: 5 minute tak wahi cached data use karo, dobara server mat puchho
      staleTime: 1000 * 60 * 5,
    },
  },
});

// -----------------------------------------------------------------------------
// APPPROVIDER COMPONENT
// -----------------------------------------------------------------------------
// Yeh ek functional component hai.
// "React.FC<AppProviderProps>" ka matlab:
//   - React.FC = React Functional Component
//   - <AppProviderProps> = Generic — is component ko yeh props milenge (types/index.ts se)
//
// Children prop ki wajah se jo bhi is component ke andar likha ho,
// woh wahan render ho jata hai jahan {children} likha hai.

import { ThemeProvider } from './context/ThemeContext'; // Theme state provider wrapper
import { TaskProvider } from './context/TaskContext'; // Tasks database state provider wrapper

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    // QueryClientProvider: TanStack Query connection setup
    <QueryClientProvider client={queryClient}>
      {/* ThemeProvider: Light/Dark mode state management */}
      <ThemeProvider>
        {/* TaskProvider: Add, Delete, Edit logic management */}
        <TaskProvider>
          {children}
        </TaskProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default AppProvider;

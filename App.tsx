// =============================================================================
// FILE: App.tsx
// -----------------------------------------------------------------------------
// App ki entrypoint file jahan routing (screen navigation stack) configure hoti hai.
// =============================================================================

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context'; // Safe area environment setup
import { NavigationContainer } from '@react-navigation/native'; // React Navigation base wrapper
import { createStackNavigator } from '@react-navigation/stack'; // Stack navigator generator function
import AppProvider from './src/AppProvider'; // Combined theme, query, database providers
import { RootStackParamList } from './src/types'; // Navigation type map

// Screens import
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import TaskDetailsScreen from './src/screens/TaskDetailsScreen';
import AICoachScreen from './src/screens/AICoachScreen';

// Stack navigation object setup matching TypeScript types
const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    // SafeAreaProvider: notch aur home indicator spacing environment
    <SafeAreaProvider>
      {/* AppProvider: queryClient + theme + tasks context handlers */}
      <AppProvider>
        
        {/* NavigationContainer: Navigation manager container */}
        <NavigationContainer>
          
          {/* StatusBar setup (Status bar transparent aur dynamic text color ke liye) */}
          <StatusBar barStyle="default" />

          {/* Stack.Navigator: screen changing transitions controller */}
          <Stack.Navigator
            initialRouteName="Login" // App open hote hi pehle login page dikhega
            screenOptions={{
              headerShown: false, // Har screen pe custom header display kya hai isliye default hide
              cardStyle: { backgroundColor: 'transparent' } // Background colors screens handle karengi
            }}
          >
            {/* Navigational screens routing keys mapping */}
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="TaskDetails" component={TaskDetailsScreen} />
            <Stack.Screen name="AICoach" component={AICoachScreen} />
          </Stack.Navigator>

        </NavigationContainer>

      </AppProvider>
    </SafeAreaProvider>
  );
}

export default App;

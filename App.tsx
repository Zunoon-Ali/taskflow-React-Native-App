// =============================================================================
// FILE: App.tsx
// -----------------------------------------------------------------------------
// App ki entrypoint file jahan routing (screen navigation stack) configure hoti hai.
// IMPORTANT: react-native-gesture-handler MUST be the very first import.
// =============================================================================

// Must be first import — gesture-handler needs to be set up before navigation
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import React from 'react';
import { StatusBar } from 'react-native';
import { enableScreens } from 'react-native-screens'; // Native screen optimization
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AppProvider from './src/AppProvider';
import { RootStackParamList } from './src/types';

// Enable native screens before any navigation renders
enableScreens();

// Screens import
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import TaskDetailsScreen from './src/screens/TaskDetailsScreen';
import AICoachScreen from './src/screens/AICoachScreen';

// Stack navigation object setup matching TypeScript types
const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <NavigationContainer>
            <StatusBar barStyle="dark-content" backgroundColor="#F8FAFF" />

            <Stack.Navigator
              initialRouteName="Login"
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="TaskDetails" component={TaskDetailsScreen} />
              <Stack.Screen name="AICoach" component={AICoachScreen} />
            </Stack.Navigator>

          </NavigationContainer>
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;

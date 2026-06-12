# AsyncStorage Persistence & Session Management

This document details how `@react-native-async-storage/async-storage` is used in TaskFlow for offline-first task persistence and user session state management.

---

## 1. Installation Overview

AsyncStorage provides an asynchronous, unencrypted, key-value storage system for React Native apps.
```bash
npm install @react-native-async-storage/async-storage
```

---

## 2. Task State Persistence (`TaskContext.tsx`)

Tasks are managed in a global `TaskContext` provider which acts as a wrapper around AsyncStorage syncing:

### Loading Tasks on Startup (`loadTasks`)
When the application launches, the context checks for any previously stored tasks:
```typescript
const loadTasks = async () => {
  const savedTasks = await AsyncStorage.getItem('app_tasks');
  if (savedTasks) {
    setTasks(JSON.parse(savedTasks));
  } else {
    // If launching for the very first time, fetch sample todos from JSONPlaceholder API
    const response = await axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5');
    const initialTasks = response.data.map((item, index) => ({
      id: item.id.toString(),
      title: item.title,
      completed: item.completed,
      priority: 'MEDIUM',
      description: '',
      aiSuggestion: '',
    }));
    setTasks(initialTasks);
    await AsyncStorage.setItem('app_tasks', JSON.stringify(initialTasks));
  }
};
```

### Syncing Updates (`saveTasksToStorage`)
Every state modification (adding, completing, editing, or deleting a task) automatically writes back to AsyncStorage:
```typescript
const saveTasksToStorage = async (newTasks: Task[]) => {
  setTasks(newTasks);
  try {
    await AsyncStorage.setItem('app_tasks', JSON.stringify(newTasks));
  } catch (error) {
    console.error('AsyncStorage sync failed:', error);
  }
};
```

---

## 3. User Session Persistence (`LoginScreen.tsx`)

To ensure a premium, modern experience where users do not need to log in repeatedly on every app restart:

### Creating Session on Login
Upon successful username/email validation, the session is written to AsyncStorage:
```typescript
const handleLogin = async () => {
  // Input validations...
  try {
    await AsyncStorage.setItem('logged_in_user', username.trim());
  } catch (error) {
    console.error('Failed to save user session:', error);
  }
  navigation.replace('Home', { username: username.trim() });
};
```

### Automatic Session Recovery (App Start)
When the `LoginScreen` mounts, it checks for a saved session in local storage. If present, it directly replaces the routing stack and redirects the user to the `HomeScreen`:
```typescript
useEffect(() => {
  const checkSession = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('logged_in_user');
      if (savedUser) {
        navigation.replace('Home', { username: savedUser });
      }
    } catch (error) {
      console.error('Failed to load user session:', error);
    }
  };
  checkSession();
}, []);
```

### Terminating User Session (`HomeScreen.tsx`)
When the user clicks the "Logout" button in the home header, the active session is deleted:
```typescript
const handleLogout = async () => {
  try {
    await AsyncStorage.removeItem('logged_in_user');
    navigation.replace('Login');
  } catch (error) {
    console.error('Failed to clear user session:', error);
  }
};
```
This forces the stack navigation to return to the `LoginScreen`, allowing other users to log in or use autofill.

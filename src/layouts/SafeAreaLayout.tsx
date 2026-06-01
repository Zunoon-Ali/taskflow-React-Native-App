// =============================================================================
// FILE: src/layouts/SafeAreaLayout.tsx
// -----------------------------------------------------------------------------
// Yeh file kya karti hai?
//   Yeh ek "layout wrapper" hai — matlab yeh baaki screens ko wrap karta hai.
//
// "SafeArea" kya hota hai?
//   Mobile phones mein kuch areas hote hain jo app use nahi kar sakti —
//   jaise iPhone ka "notch" (upar wala khacha) ya Android ka status bar.
//   SafeArea in areas se bachata hai — content unke neeche nahi ghusta.
//
// Yeh component kyun banana?
//   Toh har screen pe alag alag SafeAreaView aur StatusBar likhne ki zaroorat na ho.
//   Ek jagah likho, saari screens ko deo — DRY principle (Don't Repeat Yourself).
// =============================================================================

import React from 'react';
import { StyleSheet, SafeAreaView, View, StatusBar, useColorScheme } from 'react-native';

// Colors aur SafeAreaLayoutProps apni files se import kar rahe hain
import { Colors } from '../styles';
import { SafeAreaLayoutProps } from '../types';

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export const SafeAreaLayout: React.FC<SafeAreaLayoutProps> = ({ children }) => {
  // useColorScheme(): yeh React Native ka built-in hook hai.
  // Batata hai ke user ka phone light mode pe hai ya dark mode pe.
  // Return karta hai: 'light' ya 'dark' (ya null agar pata na chale)
  const isDarkMode = useColorScheme() === 'dark';

  // isDarkMode ke hisaab se background color chunna —
  // true hai toh dark wala use karo, false hai toh light wala
  const backgroundColor = isDarkMode
    ? Colors.dark.background   // '#0F172A' — dark navy
    : Colors.light.background; // '#F8FAFC' — cool white

  return (
    // SafeAreaView: React Native ka component jo safe area mein render karta hai
    // flex: 1 matlab: jitni jagah available hai sab le lo (poora screen)
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>

      {/* StatusBar: phone ke upar wali bar (battery, time etc.) ko style karna */}
      {/* barStyle: dark mode mein light text, light mode mein dark text */}
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundColor}
      />

      {/* Inner container: thodi padding dete hain taake content edges se chipke nahi */}
      <View style={styles.container}>
        {/* children: jo bhi component is SafeAreaLayout ke andar likha ho wo yahan aayega */}
        {children}
      </View>

    </SafeAreaView>
  );
};

// -----------------------------------------------------------------------------
// STYLES — is component ki CSS
// -----------------------------------------------------------------------------
// Styles ko component se ALAG rakha hai — yeh best practice hai.
// Sabse neeche styles likhne se component ka structure upar saaf dikhta hai.

const styles = StyleSheet.create({
  // poora screen cover karna
  safeArea: {
    flex: 1, // flex: 1 = "bhai poori jagah meri hai"
  },

  // andar thodi breathing room dena — content edges pe nahi chipkna chahiye
  container: {
    flex: 1,
    paddingHorizontal: 20, // left aur right se 20 pixel andar
    paddingVertical: 16,   // upar aur neeche se 16 pixel
  },
});

export default SafeAreaLayout;

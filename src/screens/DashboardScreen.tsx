// =============================================================================
// FILE: src/screens/DashboardScreen.tsx
// -----------------------------------------------------------------------------
// Yeh file kya hai?
//   App ki pehli screen — "Dashboard". Yahan user ko sab kuch dikhta hai:
//   Flask connection status, architecture info, aur Android setup guides.
//
// "Screen" component kya hota hai?
//   Layout nahi, components nahi — Screen woh hoti hai jo user directly dekhta hai.
//   Ek page ki tarah. Navigation mein screens aati jaati hain.
//
// Yeh screen specifically kya dikhati hai?
//   1. App ka welcome heading
//   2. Flask server ka live connection status
//   3. Android build setup guide cards
//   4. Ek button jo React Native docs kholta hai
// =============================================================================

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  useColorScheme,
} from 'react-native';

// Apne components import kar rahe hain
import Card from '../components/Card';

// Apna custom hook — Flask se data lene wala
import useFlaskStatus from '../hooks/useFlaskApi';

// Colors aur Typography styles import
import { Colors, Typography } from '../styles';

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export const DashboardScreen: React.FC = () => {

  // Dark mode detect karna
  const isDarkMode = useColorScheme() === 'dark';

  // useFlaskStatus hook call kar rahe hain —
  // isse hume 3 cheezein milti hain:
  //   data (server ka response, hamare case mein "serverInfo" naam diya)
  //   refetch (ek function jo dobara data fetch karta hai)
  //   isFetching (boolean — true hai jab fetch chal raha ho)
  const { data: serverInfo, refetch, isFetching } = useFlaskStatus();

  // -----------------------------------------------------------------------------
  // EVENT HANDLER
  // -----------------------------------------------------------------------------
  // Yeh function tab chalta hai jab user "Open Docs" button dabae.
  // Linking.openURL(): phone ka browser kholta hai given URL ke sath.
  const handleOpenDocs = () => {
    Linking.openURL('https://reactnative.dev/docs/environment-setup');
  };

  // -----------------------------------------------------------------------------
  // LOGIC: Badge color decide karna
  // -----------------------------------------------------------------------------
  // serverInfo?.status: "optional chaining" — agar serverInfo null ho toh crash nahi
  // Ternary operator: condition ? agar_sach : agar_jhoot
  // Matlab: agar status 'Standby' hai toh amber (peela), warna green
  const badgeColor = serverInfo?.status === 'Standby'
    ? Colors.warning   // '#F59E0B' — yellow/amber
    : Colors.success;  // '#10B981' — green

  const displayStatus = serverInfo?.status === 'Standby' ? 'Standby' : 'Connected';

  // -----------------------------------------------------------------------------
  // JSX RETURN — jo screen pe dikhega
  // -----------------------------------------------------------------------------
  return (
    // ScrollView: agar content screen se bada ho toh scroll karo
    // contentContainerStyle: andar wale container ka style
    // showsVerticalScrollIndicator: scroll bar dikhao ya nahi — false = nahi
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >

      {/* ---- HEADER SECTION ---- */}
      <View style={styles.headerSection}>
        <Text style={[styles.welcomeHeading, isDarkMode ? styles.darkText : styles.lightText]}>
          TaskFlow CLI 🚀
        </Text>
        <Text style={styles.subtitleText}>
          React Native • TanStack Query • Axios • Flask Ready
        </Text>
      </View>

      {/* ---- FLASK STATUS SECTION ---- */}
      <View style={styles.section}>

        {/* Section heading — dynamic dark/light style */}
        <Text style={[styles.sectionLabel, isDarkMode ? styles.darkMuted : styles.lightMuted]}>
          Flask Backend Status
        </Text>

        {/* Card component use kar rahe hain — upar banaya wala */}
        {/* "??" = nullish coalescing — agar null ya undefined ho toh 'Unknown' do */}
        <Card
          title={`Flask API: ${serverInfo?.status ?? 'Unknown'}`}
          description={serverInfo?.message ?? ''}
          status={displayStatus}
          badgeColor={badgeColor}
        />


        {/* Retry button — Flask se dobara connect karne ke liye */}
        {/* disabled: jab fetch chal raha ho toh button disable karo — spam na ho */}
        <TouchableOpacity
          activeOpacity={0.8}        // Press pe thodi transparency aaye
          style={[styles.primaryBtn, { backgroundColor: Colors.primary }]}
          onPress={() => refetch()}  // Dabne pe refetch function call karo
          disabled={isFetching}      // Loading mein disable
        >
          <Text style={styles.primaryBtnText}>
            {/* Ternary: loading mein alag text, normal mein alag */}
            {isFetching ? 'Connecting...' : 'Retry Flask Connection'}
          </Text>
        </TouchableOpacity>

      </View>

      {/* ---- ANDROID SETUP GUIDE SECTION ---- */}
      <View style={styles.section}>

        <Text style={[styles.sectionLabel, isDarkMode ? styles.darkMuted : styles.lightMuted]}>
          Android Build Errors — Fix Karo
        </Text>

        {/* Card 1: JAVA_HOME */}
        <Card
          title="1. JAVA_HOME Set Karo"
          description="JDK 17 install karo. Phir System Environment Variables mein JAVA_HOME naam ka variable banao aur value mein JDK ka folder path dalo. Restart karo terminal."
          status="JAVA"
          badgeColor={Colors.error}
        />

        {/* Card 2: ADB */}
        <Card
          title="2. ADB Command Fix Karo"
          description="PATH variable mein Android SDK ka platform-tools folder add karo: C:\Users\<Username>\AppData\Local\Android\Sdk\platform-tools"
          status="ADB"
          badgeColor={Colors.error}
        />

        {/* Card 3: Emulator */}
        <Card
          title="3. Emulator Pehle Chalao"
          description="Android Studio kholo → Device Manager → Emulator start karo → Tab npm run android chalaao jab emulator screen aa jaye."
          status="AVD"
          badgeColor={Colors.info}
        />

      </View>

      {/* ---- DOCS BUTTON ---- */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.outlineBtn, { borderColor: isDarkMode ? Colors.dark.border : Colors.light.border }]}
        onPress={handleOpenDocs}
      >
        <Text style={[styles.outlineBtnText, { color: isDarkMode ? Colors.dark.text : Colors.light.text }]}>
          Official Setup Docs Kholo
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

// -----------------------------------------------------------------------------
// STYLES
// -----------------------------------------------------------------------------
const styles = StyleSheet.create({
  // ScrollView ke andar wali extra space
  scrollContent: {
    paddingBottom: 48,
  },

  // App ka main heading area
  headerSection: {
    marginVertical: 20,
  },

  // "TaskFlow CLI 🚀" wala bada heading
  welcomeHeading: {
    ...Typography.h1,
  },

  // Neeche wali choti line
  subtitleText: {
    ...Typography.bodySmall,
    color: Colors.light.textMuted,
    marginTop: 6,
  },

  // Har section ka container
  section: {
    marginVertical: 14,
  },

  // "FLASK STATUS" / "ANDROID ERRORS" wali section label
  sectionLabel: {
    ...Typography.label,
    marginBottom: 10,
  },

  // Dark/light mode ke liye text colors
  lightText: { color: Colors.light.text },
  darkText: { color: Colors.dark.text },
  lightMuted: { color: Colors.light.textMuted },
  darkMuted: { color: Colors.dark.textMuted },

  // Primary (filled) button style
  primaryBtn: {
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryBtnText: {
    ...Typography.button,
    color: Colors.white,
  },

  // Outline (border only) button style
  outlineBtn: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 24,
  },
  outlineBtnText: {
    ...Typography.button,
  },
});

export default DashboardScreen;

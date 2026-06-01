// =============================================================================
// FILE: src/components/Card.tsx
// -----------------------------------------------------------------------------
// Yeh file kya karti hai?
//   Ek reusable "Card" UI component — jaise physical card hoti hai,
//   usi tarah ek box jisme title, description aur status badge hota hai.
//
// "Reusable" kyun?
//   Ek baar banao, baar baar use karo — bas alag alag data do.
//   Jaise: server status card, task card, error card — sab isi se bante hain.
//
// Props kya hote hain?
//   Jab ek component dusre se kuch data leta hai, use "props" kehte hain.
//   Jaise: <Card title="Hello" description="World" />
//   Yahan title aur description props hain.
// =============================================================================

import React from 'react';
import { StyleSheet, View, Text, useColorScheme } from 'react-native';

// Types aur styles apni dedicated files se import kar rahe hain — organized!
import { CardProps } from '../types';
import { Colors, Typography } from '../styles';

// -----------------------------------------------------------------------------
// COMPONENT DEFINITION
// -----------------------------------------------------------------------------
// "React.FC<CardProps>" ka matlab:
//   FC = Functional Component
//   <CardProps> = Generic — yeh batata hai is component ko kaunse props milenge
//
// Props destructuring: { title, description, status, badgeColor = '#3B82F6' }
//   Matlab: CardProps object se directly in values ko nikal lo.
//   badgeColor = '#3B82F6' matlab: agar caller ne badgeColor na diya, toh blue use karo.

export const Card: React.FC<CardProps> = ({
  title,
  description,
  status,
  badgeColor = Colors.primary, // Default color — Colors file se le rahe hain
}) => {
  // Dark mode detect karna — phone ki setting ke hisaab se styling badlegi
  const isDarkMode = useColorScheme() === 'dark';

  return (
    // View: React Native mein div ki tarah — ek box/container
    // style={[...]} array mein multiple styles daal sakte hain —
    // base card style + conditional dark/light style
    <View style={[styles.card, isDarkMode ? styles.darkCard : styles.lightCard]}>

      {/* Header row: title aur badge ek line mein */}
      <View style={styles.header}>

        {/* Title text — dark/light mode ke hisaab se color */}
        <Text style={[styles.title, isDarkMode ? styles.darkTitle : styles.lightTitle]}>
          {title}
        </Text>

        {/* Status badge — sirf tab dikhao jab status prop diya ho */}
        {/* "&&" = short-circuit: agar status truthy hai tabhi Badge render ho */}
        {status && (
          <View style={[styles.badge, { backgroundColor: badgeColor }]}>
            {/* badgeText style mein 'uppercase' set hai — choti caps se badi ho jati hai */}
            <Text style={styles.badgeText}>{status}</Text>
          </View>
        )}

      </View>

      {/* Description text — main content */}
      <Text style={[styles.description, isDarkMode ? styles.darkDesc : styles.lightDesc]}>
        {description}
      </Text>

    </View>
  );
};

// -----------------------------------------------------------------------------
// STYLES — component ki CSS/styling
// -----------------------------------------------------------------------------
// Styles ko neeche rakha hai taake upar component ka structure clearly dikhe.
// Colors file se values use kar rahe hain — koi magic strings nahi!

const styles = StyleSheet.create({
  // Base card style — dono themes mein common cheezein
  card: {
    borderRadius: 16,       // Rounded corners — premium look
    padding: 16,            // Andar se space
    marginVertical: 8,      // Upar neeche space dono cards ke beech
    shadowOffset: { width: 0, height: 4 }, // Shadow neeche ki taraf
    shadowOpacity: 0.08,    // Shadow thodi halki ho — 8%
    shadowRadius: 8,        // Shadow kitni badi/blur ho
    elevation: 3,           // Android mein shadow ke liye yeh use hota hai
  },

  // Light mode card
  lightCard: {
    backgroundColor: Colors.light.surface, // '#FFFFFF' — white
    shadowColor: Colors.light.shadow,      // '#64748B' — grey shadow
  },

  // Dark mode card
  darkCard: {
    backgroundColor: Colors.dark.surface, // '#1E293B' — dark navy
    shadowColor: Colors.dark.shadow,      // '#000000' — black shadow
  },

  // Header row layout
  header: {
    flexDirection: 'row',         // Horizontal: title aur badge side by side
    justifyContent: 'space-between', // Dono ko edges pe push karo
    alignItems: 'center',         // Vertically center karo
    marginBottom: 8,              // Description se thodi gap
  },

  // Title base style
  title: {
    ...Typography.h4, // Typography file se h4 style le rahe hain — "spread" operator
    flex: 1,          // Title zyada jagah le — badge ki jagah chhodi
    marginRight: 8,   // Badge ke baad thodi gap
  },

  lightTitle: { color: Colors.light.text },   // '#0F172A' — almost black
  darkTitle: { color: Colors.dark.text },     // '#F8FAFC' — almost white

  // Description text style
  description: {
    ...Typography.bodySmall, // Chhota body text
  },

  lightDesc: { color: Colors.light.textMuted }, // '#475569' — grey
  darkDesc: { color: Colors.dark.textMuted },   // '#94A3B8' — light grey

  // Badge pill shape
  badge: {
    borderRadius: 20,         // Puri tarah round — pill shape
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  // Badge text — white aur uppercase always
  badgeText: {
    ...Typography.label, // label style: small, bold, uppercase
    color: Colors.white,
  },
});

export default Card;

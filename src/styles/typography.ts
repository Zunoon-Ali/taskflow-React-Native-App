// =============================================================================
// FILE: src/styles/typography.ts
// -----------------------------------------------------------------------------
// Yeh file kya karti hai?
//   Text se related saari styling yahan hai — font sizes, weights (bold etc.)
//   aur line heights. Agar UI mein koi text ka style badalna ho, yahan se
//   badlo, saari jagah update ho jayega.
//
// "Typography" ka matlab?
//   Font related design system — kitna bada heading ho, kitna body text ho,
//   etc. Professional apps mein yeh sab defined hota hai.
// =============================================================================

import { StyleSheet } from 'react-native';

// StyleSheet.create() kya karta hai?
// Yeh React Native ka built-in method hai jo styles ko optimized banata hai.
// Normal JS object se zyada fast hota hai kyunki Native side pe cache ho jata hai.

const Typography = StyleSheet.create({

  // -----------------------------------
  // HEADINGS — bade titles
  // -----------------------------------

  // Sab se bada heading — screen ki main title ke liye
  h1: {
    fontSize: 28,
    fontWeight: '800',   // '800' = Extra Bold — aik scale 100 se 900 tak hoti hai
    lineHeight: 36,      // Line height = text ki "height" — letters ke upar neeche space
  },

  // Thoda chhota heading — sections ke liye
  h2: {
    fontSize: 22,
    fontWeight: '700',   // Bold
    lineHeight: 30,
  },

  // Sub-section heading
  h3: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 26,
  },

  // Card titles aur list items ke liye
  h4: {
    fontSize: 16,
    fontWeight: '600',   // Semi-bold
    lineHeight: 22,
  },

  // -----------------------------------
  // BODY TEXT — normal reading text
  // -----------------------------------

  // Main paragraph text
  body: {
    fontSize: 14,
    fontWeight: '400',   // Normal weight — nahi likha to bhi same hota hai
    lineHeight: 22,
  },

  // Thoda chhota body text — secondary info ke liye
  bodySmall: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
  },

  // -----------------------------------
  // UTILITY TEXT — special uses
  // -----------------------------------

  // Button text — thoda medium weight
  button: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },

  // Labels, badges, tags — choti choti chips ke liye
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,  // Letters ke beech thodi gap — professional lagta hai
    textTransform: 'uppercase' as const,
    // "as const" kyun? TypeScript ko batana padta hai ke 'uppercase' ek fixed value hai,
    // warna wo samajhta hai ke koi bhi string hogi — error aa sakta tha
  },

  // Caption — images ke neeche ya footnotes mein chhota text
  caption: {
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 16,
  },
});

export default Typography;

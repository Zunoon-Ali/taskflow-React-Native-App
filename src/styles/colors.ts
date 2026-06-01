// =============================================================================
// FILE: src/styles/colors.ts
// -----------------------------------------------------------------------------
// Yeh file kya karti hai?
//   Poori app ke saare RANG (colors) yahan ek jagah define hain.
//   Jab kabhi koi color change karna ho — sirf yahan se badlo, baki sab
//   automatically update ho jayega. Itni achi baat hai na?
//
// Kyun magic strings nahi likhte direct?
//   Agar har jagah '#3B82F6' likho aur kal color change karna pare,
//   toh poori app mein dhundhna padega. Yahan se badlo — sab ho gaya.
// =============================================================================

// -----------------------------------------------------------------------------
// THEME COLORS — yeh hum do alag color palettes banate hain
// Light mode (din wala) aur Dark mode (raat wala) ke liye alag alag
// -----------------------------------------------------------------------------

const Colors = {

  // -----------------------------------
  // BRAND COLORS — app ki "pehchaan" (SZABIST themes)
  // -----------------------------------
  primary: '#2563EB',    // Accent blue — buttons ke liye
  secondary: '#1A3A8F',  // SZABIST Blue
  accent: '#E8A020',     // SZABIST Gold — high priority aur highlight badges ke liye
  navy: '#0D1B3E',       // Navy background / titles ke liye
  lightBlue: '#F0F5FF',  // Light Blue tint

  // -----------------------------------
  // STATUS COLORS — badges aur states
  // -----------------------------------
  success: '#16A34A',    // Green (Complete status)
  warning: '#E8A020',    // Gold (Medium priority)
  error: '#DC2626',      // Red (High priority / warning)
  info: '#2563EB',       // Blue (Low priority)

  // -----------------------------------
  // LIGHT MODE COLORS — light theme (mockup style)
  // -----------------------------------
  light: {
    background: '#EBF2FC',  // Light tint blue background
    surface: '#FFFFFF',     // Cards / input containers (pure white)
    text: '#0D1B3E',        // Main text (navy)
    textMuted: '#64748B',   // Subtitle text
    border: '#E2E8F0',      // Lines aur inputs border
    shadow: '#CBD5E1',      // Shadow color
  },

  // -----------------------------------
  // DARK MODE COLORS — dark theme (mockup style)
  // -----------------------------------
  dark: {
    background: '#0D1B3E',  // Dark navy background
    surface: '#142247',     // Dark blue cards
    text: '#FFFFFF',        // White text
    textMuted: '#94A3B8',   // Light grey text
    border: '#1E293B',      // Borders
    shadow: '#000000',      // Black shadow
  },

  // -----------------------------------
  // COMMON — dono themes mein same
  // -----------------------------------
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

// "export default" matlab: jab koi yeh file import kare, toh directly
// Colors object mil jaye. Jaise: import Colors from '../styles/colors'
export default Colors;

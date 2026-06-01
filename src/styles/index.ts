// =============================================================================
// FILE: src/styles/index.ts
// -----------------------------------------------------------------------------
// Yeh file kya hai?
//   Ek "barrel" file — iska kaam hai ke baaki jagah sirf EK import likhna pade.
//
// Bina is file ke:
//   import Colors from '../styles/colors';
//   import Typography from '../styles/typography';
//
// Is file ki wajah se:
//   import { Colors, Typography } from '../styles';   <-- kitna clean!
//
// Acha shortcut hai na? Yeh pattern professional codebases mein hamesha hota hai.
// =============================================================================

// dono files se saari cheezein export kar do
export { default as Colors } from './colors';
export { default as Typography } from './typography';

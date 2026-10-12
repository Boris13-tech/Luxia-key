# LUXIA Key Personal — UX Baseline V1

Official reference: existing Google AI Studio React UI at main commit 4d61d941b94111f0977056a840827e97e092f73c.
Exact UI files and Git object hashes: UX-BASELINE-MANIFEST.json. All src files, index.html, metadata.json and vite.config.ts remain unchanged. Dependency locking is a separately reviewed reproducibility change.

| Screen | Experience |
|---|---|
| 01 | Splash / Welcome |
| 02 | Create Identity |
| 03 | Initial Security Setup |
| 04 | Dashboard |
| 05 | Accounts |
| 06 | Account Detail |
| 07 | Devices |
| 08 | Authentication Request |
| 09 | Scanner |
| 10 | Sensitive Action |
| 11 | Activity |
| 12 | Security |
| 13 | Identity Lock |
| 14 | Recovery |
| 15 | My Identity |
| 16 | Settings |

The src/data/mockData.ts fixtures, App.tsx state transitions, timed BiometricModal success, pairing, recovery, QR and TOTP modals are prototype simulations. Historical Face ID wording is preserved only in this frozen prototype; the foundation SDK uses Device verification. No prototype screen is connected to production authorization.
Build with pnpm build. No destructive move has occurred. Proposed ux-baseline-v1 tag is documented in release governance and remains uncreated.

# Security corrections relative to UX Baseline V1

The original Google AI Studio UX and its Git-blob manifest remain frozen at 4d61d941b94111f0977056a840827e97e092f73c. No screen, styling, label, navigation or layout is redesigned.

After the user authorized completing the necessary engineering safeguards, Screen6AccountDetail received exactly two source-line changes: import the shared HTTPS URL validator and use its result for the website link's href. Normal account links retain their HTTPS destination. Unsafe or ambiguous input (HTML injection, credentials in authority, control characters, invalid port or embedded scheme) is non-navigable while its label remains React-escaped text.

The baseline preservation test reconstructs exactly this patch from the original Git object; any other change to this component fails, and every other original UI file remains checked against its original blob hash. The original manifest is never rewritten to bless the correction. The validator and renderer tests verify denial payloads and all twelve existing account destinations.

This is an explicit security correction, not a redesigned UX or real authorization capability. Prototype passkeys, pairing, TOTP, recovery and biometric animations remain simulations.

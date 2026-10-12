# Read-only repository inspection — 2026-10-12

Default branch main; main SHA 4d61d941b94111f0977056a840827e97e092f73c. Other observed branch feat/security-core-v1 at 65971e7b1af19644e4ebc74bbb95c65ab73b7981. Main parent a553782; security work parent d9d47cd. git merge-base returned no common ancestor. Do not merge these histories.
Main: React/Vite/Tailwind prototype, 16 screens, mockData/local state/timed biometric simulation, no API, no workflow, no lockfile. Original package manifest combined unused server/AI dependencies with frontend tools.
Security branch: in-memory DatabaseStore, seeded identity, public-key verification through SimpleWebAuthn but optional UV; frontend imports server with API-failure fallback; caller-controlled origin configuration; session hash concept without persistence; audit accepts arbitrary details and incomplete redaction.
Old CI run 37892838220 failed at setup-node npm-cache lookup because no npm lock existed (only bun.lock). Workflow also contained install fallback and ignored audit failure. None of those patterns were ported.
Selective reapplication: retained the SimpleWebAuthn options/verify decomposition, public-key-only storage, cryptographically random hashed session concept, expiration/revocation and event categories. Reimplemented persistence, trust configuration, challenge binding, authorization, error handling and tests. No old branch file was blindly copied and no old UI changes imported.
GitHub reported main unprotected. Architectural review and activation of required checks are merge blockers. No tags or production resources were modified.

This is the initial read-only snapshot. The authorized follow-up later enabled and read back main protection and active scanning ruleset 24933031; see ../governance/ENGINEERING-GOVERNANCE.md. Main's code SHA did not change.

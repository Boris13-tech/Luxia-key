# LK-REMEDIATION-001 — implementation and automated evidence checkpoint

Original independent review: LK-REVIEW-001, fixed HEAD be526ac341ad139f4140bb6eb8dd74e6abc0b501, Architecture FAIL / Security FAIL. Original commit/history and UX manifest remain preserved.
Remediation implementation checkpoint: f6c31a38e97c9503a40e55df73d719f772d4ebd5. Only Foundation R1–R4 and necessary regression/docs changes are in scope. ADR 0001 is the decision record; the architecture/protocol and manifest remain the normative contracts.

- R1: mandatory frozen LUXIA_RUNTIME_MODE; central secure host-only cookies; explicit local exception; forged headers cannot select policy.
- R2: shared immutable ES256/RS256 generation/verifier allowlist; real library tests reject Ed25519 and unknown COSE algorithms.
- R3: immutable version/checksum manifest; explicit migration bundle/state checks; read-only startup gate before listener; real PostgreSQL metadata, permission, timeout and outage tests.
- R4: malformed/unparseable requests deny without burning; valid-shaped bound attempts atomically consume; crypto failure stays burned; unrelated bindings cannot consume.

Automated evidence on implementation checkpoint: [Foundation](https://github.com/Boris13-tech/Luxia-key/actions/runs/38272028923), [PR Foundation](https://github.com/Boris13-tech/Luxia-key/actions/runs/38272034590), [CodeQL](https://github.com/Boris13-tech/Luxia-key/actions/runs/38272028939), [PR CodeQL](https://github.com/Boris13-tech/Luxia-key/actions/runs/38272034592): PASS. Thirty unit, thirty-four security and forty-nine SQL tests passed (35 core + 14 startup), total 113; database-process restart persistence, typecheck, lint, build, Gitleaks and dependency audit passed. CodeQL actual analysis reported zero findings.

Local SQL execution remains unavailable because the Docker Linux engine is absent; real SQL evidence is from disposable CI PostgreSQL, not mocked. Local unit/security/typecheck/lint/build/audit passed. Credential fixtures use standard Node crypto and real library verification, but are synthetic, never physical certification.

The original positive configuration test now explicitly sets the trusted runtime; no trust assertion was weakened. All original deny/UV/RP/TTL/session/audit/UX tests remain. Full raw startup SQL tests run as part of test:integration; failure cannot be skipped.

The final documentation commit has its own SHA and must pass its own checks before a distinct LK-REVIEW-002 examines that exact HEAD. This checkpoint is automated evidence, not independent architectural/security approval. The review and final sealed handoff are exported outside the Git tree to avoid self-reference. No main merge, production, physical certification, eligible second-account approval or Phase 2 is claimed.

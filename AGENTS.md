# LUXIA Key engineering contract

Read docs/architecture/ARCHITECTURE.md and docs/security/SECURITY-INVARIANTS.md before implementation.
Codex and Claude Code have equal engineering authority. The active agent owns the task; neither agent self-certifies independent review.
Check .ai/WORK-OWNERSHIP.md before edits. No concurrent modification of owned files. Transfer ownership with a complete handoff.
Work from main on a task branch. Never merge unrelated histories. No direct main commits, production changes, secrets, or bypassed gates.
Preserve UX Baseline V1. Prototype behavior is not a security capability. Deny uncertain security state.
Run frozen install, typecheck, lint, unit, security, PostgreSQL integration, build, secret scan and dependency audit. Report real results; hardware certification is separate.
Stop at task scope. Architectural review is required before merge or release.

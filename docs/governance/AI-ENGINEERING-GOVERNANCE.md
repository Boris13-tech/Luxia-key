# AI engineering governance

Codex and Claude Code have equal authority under AGENTS.md. Active ownership is recorded in .ai/WORK-OWNERSHIP.md; inactive agents consume .ai/HANDOFF.md before resuming.
No concurrent edits to owned files. Transfer ownership explicitly, including dirty state and exact next command. Agent output is untrusted until inspected and tested.
AI cannot make critical authorization decisions, grant production access, waive security invariants, fabricate PASS, or approve its own architectural review.
Use .ai/HANDOFF-TEMPLATE.md without omitting fields. Never include secrets or raw sensitive payloads in handoffs.

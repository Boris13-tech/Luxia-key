# Repository migration plan

1. Freeze and hash the existing UI. Keep root dev/build working and add a single pnpm lockfile.
2. Add isolated services/api, SDK and conceptual design tokens; no source move in this task.
3. After review, move root src/index/config to apps/prototype-web in a dedicated PR, adjusting paths and comparing all 16 screens. Retain rollback by reverting that single move.
4. Introduce real apps/web flows using shared contracts/tokens only after security certification and UX review. Never import the prototype's simulation into the real app.
5. Add SwiftUI/Jetpack Compose separately in later tasks; use visual tokens and interaction specifications, never mechanical TSX conversion.

Target directories: apps/{prototype-web,web,ios,android}, services/api, packages/{protocol,contracts,design-tokens,sdk-js,sdk-node}, docs, infra, tests, .ai. Empty targets are documented placeholders, not working capabilities.
Baseline build remains root pnpm build throughout this task. No conflicting Bun/npm workflow was copied from the unrelated branch.

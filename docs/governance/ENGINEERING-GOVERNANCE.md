# Engineering governance

Architecture is normative for both agents. Security invariants override convenience; disagreements require a documented decision and human architectural review.
Every change needs one accountable owner, a main-based branch, reproducible checks, traceable commit and independent review. A passing test is evidence only for the tested behavior.
Required checks: Foundation gates, Secret scan, CodeQL. Require one independent approval, dismiss stale approvals, require resolved conversations and up-to-date checks, prevent force push/deletion, apply to administrators.
Initial inspection on 2026-10-12 found main unprotected. After the user's follow-up authorization, main protection was enabled and read back from GitHub: strict required Foundation gates, Secret scan and CodeQL checks bound to GitHub Actions app 15368; one approving reviewer; stale approval dismissal; latest push approved by someone other than its pusher; resolved conversations; linear history; no force push or deletion; enforcement for administrators.
Active repository ruleset 24933031 additionally requires CodeQL scanning, blocks errors and High/Critical security findings, and has no bypass actors. Actual evidence and reproducible configuration are in infra/github and FOUNDATION-REVIEW.md. No main code modification, merge or production deployment is performed by these repository safeguards.
An AI author must not supply its own independent review. Review SQL, trust boundaries and negative tests as well as happy paths.

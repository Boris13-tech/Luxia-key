# Engineering governance

Architecture is normative for both agents. Security invariants override convenience; disagreements require a documented decision and human architectural review.
Every change needs one accountable owner, a main-based branch, reproducible checks, traceable commit and independent review. A passing test is evidence only for the tested behavior.
Required checks: Foundation gates, Secret scan, CodeQL. Require one independent approval, dismiss stale approvals, require resolved conversations and up-to-date checks, prevent force push/deletion, apply to administrators.
Inspection on 2026-10-12 found main unprotected. This document does not pretend to enforce GitHub settings. Owner must activate these controls before merge; no merge or production deployment is authorized in this task.
An AI author must not supply its own independent review. Review SQL, trust boundaries and negative tests as well as happy paths.

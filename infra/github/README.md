# Enforced repository governance

Applied and read back on 2026-10-12 after the user's follow-up authorization. main-protection.json and code-scanning-ruleset.json are the requested configurations; observed files are GitHub's read-back evidence. Ruleset ID: 24933031. They contain no credentials.

Main requires app-bound Foundation gates, Secret scan and CodeQL, an approving reviewer other than the author/pusher, dismissed stale approvals, current main ancestry, resolved conversations and linear history. Force pushes and deletion are denied; administrators are also subject to the rules. The active scanning ruleset has no bypass actors and blocks CodeQL errors and High/Critical security findings.

The code scanning rule also needs an analysis of the target branch. The temporary historical baseline job checks out the exact existing main SHA, verifies it, and uploads truthful analysis for that SHA/ref using the same analysis category. It does not modify main source or fabricate a clean scan. Remove this bootstrap job only in a later reviewed PR once normal main scanning is established after the first approved merge. If main advances before review, revisit this pinned bootstrap rather than mislabelling another commit's scan.

Sources: [GitHub branch protection API](https://docs.github.com/en/rest/branches/branch-protection#update-branch-protection), [repository rulesets](https://docs.github.com/en/rest/repos/rules#create-a-repository-ruleset). Enabling settings is not independent architectural approval.

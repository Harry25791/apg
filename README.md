# APG — Agent Policy Gate (Open Standard)
Minimal, agent-agnostic rules for safe micro-PRs:
- `policy.yaml` — repo policy (budgets, allowlists, dep rules, checks)
- `.apg/ops.plan.json` — the agent’s structured change plan
- Evidence pack — prompt hash, plan, budgets, CI logs attached to each PR

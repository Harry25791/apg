# APG — Agent Policy Gate (Spec v0.1)

APG is a neutral, open standard for **agent-safe micro-PRs**.

## Required repo files
- `policy.yaml` — repository policy:
  - `budgets.max_files` (int), `budgets.max_lines_changed` (int), `budgets.max_deps_bumped` (int)
  - `allow_paths` (glob allow/deny list)
  - `dep_policy.allow_levels` (`patch|minor`), `dep_policy.allowed_scopes` (regexes or names)
  - `checks.build|typecheck|lint|test` (commands to run in CI)
  - `ast_modes.default` (`tokens|ast|text`), `ast_modes.per_ext` (by file extension)
  - `require_evidence` (bool)
- `.apg/ops.plan.json` — the **structured plan** the agent proposes

## ops.plan.json (schema highlights)
- `version`: `"1"`
- `prompt_hash`: `"sha256:<hex>"`
- `agent`: free text (e.g., `"claude-code"`, `"cursor"`, `"codex-2025"`)
- `rationale`: short human-readable reason (≥10 chars)
- `changes[]`: array (≤20) of typed operations
  - `op`: one of `edit_text | edit_ast | edit_json | bump_dep | add_file | remove_file`
  - `path`: target file path
  - `selector`: AST selector/anchor (optional; required for `edit_ast`)
  - `after_replacement`: new code/text fragment (as applicable)
  - `semver`: for `bump_dep` — `patch | minor | exact:<x.y.z>`
  - `limits.max_added_lines` / `limits.max_removed_lines`: caps for this op
  - `risk`: `"low" | "medium"`

## Evidence pack (recommended)
On each PR, attach:
- `.apg/ops.plan.json`
- `prompt.hash.txt`
- `budgets.json` (calculated budgets used)
- `policy.summary.json` (policy snapshot)

## Invariants
- **Micro-PRs only:** stay within budgets; no large refactors.
- **Allowlist first:** only `allow_paths` are editable.
- **No major deps:** only patch/minor (or exact with policy exception).
- **Reproducible:** prompt hash + plan = replayable patch.
- **Advisory tools:** APG runs as GitHub/GitLab checks; agents cannot bypass branch protection.

## Non-goals
- APG is not an agent or codemod framework.
- APG does not certify correctness beyond your CI checks.

## Conformance (v0.1)
- A plan **conforms** if it validates against `schemas/ops.plan.schema.json`.
- Example conformance fixtures live in `packages/spec/examples/`.

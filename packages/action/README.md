# APG Verify Action (stub)

Usage:

```yaml
name: APG Verify
on: [pull_request]
jobs:
  apg:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - run: pnpm install --frozen-lockfile=false
      - uses: ./packages/action


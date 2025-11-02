const core = require("@actions/core");
const { execSync } = require("child_process");
const fs = require("fs");

async function run() {
  try {
    if (!fs.existsSync(".apg/ops.plan.json")) {
      core.setFailed("Missing .apg/ops.plan.json");
      return;
    }
    // Run stub CLI checks (wire real ones later)
    execSync("pnpm -s --filter @apg/cli... run build", { stdio: "inherit" });
    execSync("node packages/cli/dist/index.js plan validate .apg/ops.plan.json", { stdio: "inherit" });
    execSync("node packages/cli/dist/index.js policy check --policy policy.yaml", { stdio: "inherit" });
    core.info("APG stubs passed.");
  } catch (e) {
    core.setFailed(e.message || String(e));
  }
}
run();

const fs = require("node:fs");
const path = require("node:path");

const assetsDir = path.join(process.cwd(), ".vercel", "output", "static");
const ignorePath = path.join(assetsDir, ".assetsignore");

try {
  fs.mkdirSync(assetsDir, { recursive: true });
  fs.writeFileSync(ignorePath, "_worker.js\n", "utf8");
  console.log(`Wrote ${ignorePath}`);
} catch (err) {
  console.error("Failed to write .assetsignore", err);
  process.exitCode = 1;
}

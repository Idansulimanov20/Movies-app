import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const viteBin = path.join(rootDir, "node_modules", "vite", "bin", "vite.js");

const processes = [
  spawn(process.execPath, ["server/index.js"], {
    cwd: rootDir,
    stdio: "inherit",
    env: process.env,
  }),
  spawn(process.execPath, [viteBin, "--host", "0.0.0.0"], {
    cwd: rootDir,
    stdio: "inherit",
    env: process.env,
  }),
];

function stopAll(signal = "SIGTERM") {
  for (const child of processes) {
    if (!child.killed) child.kill(signal);
  }
}

for (const child of processes) {
  child.on("exit", (code) => {
    if (code && code !== 0) {
      stopAll();
      process.exit(code);
    }
  });
}

process.on("SIGINT", () => {
  stopAll("SIGINT");
});

process.on("SIGTERM", () => {
  stopAll("SIGTERM");
});

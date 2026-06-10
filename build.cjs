const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const dist = "dist";
const src = path.join("Vless_workers_pages", "_worker混淆.js");
const temp = path.join(dist, "worker.source.js");
const out = path.join(dist, "_worker.js");

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

let code = fs.readFileSync(src, "utf8");

// 绕过 Cloudflare/esbuild 对混淆代码里 const 重新赋值的静态报错
code = code.replace(/\bconst\b/g, "let");

// 去掉混淆器的启动自保护/console patch，降低启动负担
code = code.replace(/\ba0cl\(\);/g, "");
code = code.replace(/\ba0cH\(\);/g, "");

fs.writeFileSync(temp, code);

execFileSync(
  process.platform === "win32" ? "npx.cmd" : "npx",
  [
    "--yes",
    "esbuild",
    temp,
    "--bundle",
    "--format=esm",
    "--external:cloudflare:sockets",
    "--minify",
    "--legal-comments=none",
    `--outfile=${out}`,
  ],
  { stdio: "inherit" }
);

fs.rmSync(temp, { force: true });

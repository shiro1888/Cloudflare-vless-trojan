const fs = require("node:fs");

fs.mkdirSync("dist", { recursive: true });

let code = fs.readFileSync("Vless_workers_pages/_worker混淆.js", "utf8");
code = code.replace(/\bconst\b/g, "let");

fs.writeFileSync("dist/_worker.js", code);

import { cp, mkdir, rm } from "node:fs/promises";

const rootFiles = [
  "index.html",
  "manifest.webmanifest",
  "sw.js",
  "icon-192.png",
  "icon-512.png"
];

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });

for (const file of rootFiles) {
  await cp(file, `dist/${file}`);
}

await cp("assets", "dist/assets", { recursive: true });

console.log("Netlify static site prepared in dist/");

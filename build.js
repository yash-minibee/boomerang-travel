import { cpSync, rmSync, mkdirSync, existsSync } from "fs";

// Merge pre-built frontend and admin into dist/
// Both apps must already be built before this runs.

if (!existsSync("frontend/dist") || !existsSync("admin/dist")) {
  console.error("ERROR: frontend/dist or admin/dist not found. Build both apps first.");
  process.exit(1);
}

console.log("Merging into dist/...");
rmSync("dist", { recursive: true, force: true });
mkdirSync("dist", { recursive: true });

// Frontend → dist/
cpSync("frontend/dist", "dist", { recursive: true });

// Admin → dist/admin/
mkdirSync("dist/admin", { recursive: true });
cpSync("admin/dist", "dist/admin", { recursive: true });

console.log("Done! dist/ is ready.");

import { execSync } from "child_process";
import { cpSync, rmSync, mkdirSync } from "fs";

console.log("Building frontend...");
execSync("npm run build", { cwd: "frontend", stdio: "inherit" });

console.log("Building admin...");
execSync("npm run build", { cwd: "admin", stdio: "inherit" });

console.log("Merging into dist/...");
rmSync("dist", { recursive: true, force: true });
mkdirSync("dist", { recursive: true });

// Copy frontend build to dist/
cpSync("frontend/dist", "dist", { recursive: true });

// Copy admin build to dist/admin/
mkdirSync("dist/admin", { recursive: true });
cpSync("admin/dist", "dist/admin", { recursive: true });

console.log("Done! dist/ is ready for Vercel.");

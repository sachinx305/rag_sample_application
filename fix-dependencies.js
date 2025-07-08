#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";

console.log("🔧 Fixing ChromaDB dependencies...\n");

try {
  // Remove node_modules and package-lock.json
  console.log("🗑️  Removing existing dependencies...");
  if (fs.existsSync("node_modules")) {
    execSync("rm -rf node_modules", { stdio: "inherit" });
  }
  if (fs.existsSync("package-lock.json")) {
    execSync("rm package-lock.json", { stdio: "inherit" });
  }

  // Install dependencies with the correct versions
  console.log("📦 Installing dependencies with correct versions...");
  execSync("npm install", { stdio: "inherit" });

  console.log("✅ Dependencies fixed successfully!");
  console.log("🚀 You can now run: npm run test-chroma");
} catch (error) {
  console.error("❌ Failed to fix dependencies:", error.message);
  process.exit(1);
}

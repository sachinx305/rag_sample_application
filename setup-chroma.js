#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

console.log("🚀 Setting up ChromaDB for RAG Sample Application...\n");

// Check if Docker is installed
try {
  execSync("docker --version", { stdio: "ignore" });
  console.log("✅ Docker is installed");
} catch (error) {
  console.error("❌ Docker is not installed. Please install Docker first:");
  console.error("   https://docs.docker.com/get-docker/");
  process.exit(1);
}

// Create docker-compose.yml for ChromaDB
const dockerComposeContent = `version: '3.8'
services:
  chroma:
    image: chromadb/chroma:latest
    container_name: chromadb
    ports:
      - "8000:8000"
    environment:
      - CHROMA_SERVER_HOST=0.0.0.0
      - CHROMA_SERVER_HTTP_PORT=8000
      - CHROMA_SERVER_CORS_ALLOW_ORIGINS=["*"]
    volumes:
      - chroma_data:/chroma/chroma
    restart: unless-stopped

volumes:
  chroma_data:
`;

fs.writeFileSync("docker-compose.yml", dockerComposeContent);
console.log("✅ Created docker-compose.yml");

// Create .env file if it doesn't exist
const envContent = `# ChromaDB Configuration
CHROMA_URL=http://localhost:8000
CHROMA_COLLECTION_NAME=documents

# OpenAI Configuration
OPENAI_MODEL=gpt-4o-mini
OPENAI_API_KEY=your_openai_api_key_here

# Text Splitter Configuration
TEXT_SPLITTER_CHUNK_SIZE=1000
TEXT_SPLITTER_CHUNK_OVERLAP=200

# File Size Configuration
MAX_FILE_SIZE=52428800
LARGE_FILE_THRESHOLD=10485760
BATCH_SIZE=25

# Multer Configuration
MULTER_DEST=./uploads

# Supabase Configuration (if using Supabase instead of ChromaDB)
SUPABASE_URL=your_supabase_url_here
SUPABASE_PRIVATE_KEY=your_supabase_private_key_here
SUPABASE_DOCUMENT_VECTOR_TABLE=documents

# Gemini Configuration (alternative to OpenAI)
GEMINI_MODEL=gemini-1.5-flash
GOOGLE_API_KEY=your_google_api_key_here
`;

if (!fs.existsSync(".env")) {
  fs.writeFileSync(".env", envContent);
  console.log("✅ Created .env file");
  console.log("⚠️  Please update the .env file with your API keys");
} else {
  console.log("✅ .env file already exists");
}

// Start ChromaDB
console.log("\n🐳 Starting ChromaDB...");
try {
  execSync("docker-compose up -d", { stdio: "inherit" });
  console.log("✅ ChromaDB started successfully!");
  console.log("🌐 ChromaDB is running at: http://localhost:8000");
} catch (error) {
  console.error("❌ Failed to start ChromaDB:", error.message);
  process.exit(1);
}

console.log("\n📋 Next steps:");
console.log("1. Update your .env file with your OpenAI API key");
console.log("2. Run: npm start");
console.log("3. Test the API endpoints");

console.log("\n🛑 To stop ChromaDB later, run: docker-compose down");

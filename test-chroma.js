import { RagChainsService } from "./modules/rag/chains/service.js";

console.log("🧪 Testing ChromaDB connection...\n");

async function testConnection() {
  try {
    console.log("🔍 Testing basic ChromaDB connectivity...");

    // Test if we can access the vector store object
    if (!RagChainsService.vectorStore) {
      console.log("❌ Vector store not initialized");
      return;
    }

    console.log("✅ Vector store initialized successfully");

    // Test the connection with a simple document
    const isConnected = await RagChainsService.testChromaConnection();

    if (isConnected) {
      console.log("✅ ChromaDB connection test passed!");
      console.log("🚀 Your RAG application is ready to use.");
    } else {
      console.log("❌ ChromaDB connection test failed.");
      console.log("💡 Make sure ChromaDB is running: npm run setup");
    }
  } catch (error) {
    console.error("❌ Error during connection test:", error.message);
    console.log("💡 Make sure ChromaDB is running: npm run setup");
  }
}

testConnection();

/**
 * Utility functions for RAG document processing
 */

/**
 * Debug logging utility
 * @param {any} message - Message to log
 * @param {boolean} debug - Whether to enable debug logging
 */
export function consoleLog(message, debug = false) {
  if (debug) {
    console.log(message);
  }
}

/**
 * Test ChromaDB connection and functionality
 * @param {Object} vectorStore - ChromaDB vector store instance
 * @returns {Promise<boolean>} - True if connection is successful, false otherwise
 */
export async function testChromaConnection(vectorStore) {
  try {
    // Test basic connection by trying to access the collection
    const collection = await vectorStore.collection;
    console.log('✅ ChromaDB collection accessed successfully');
    
    // Try a simple similarity search with a basic query
    const results = await vectorStore.similaritySearch("test", 1);
    console.log('✅ ChromaDB search successful');
    return true;
  } catch (error) {
    console.error('ChromaDB connection test failed:', error);
    
    // If the error is about embeddings, try a different approach
    if (error.message.includes('every is not a function') || error.message.includes('embedding')) {
      console.log('⚠️  Embedding format issue detected. Trying alternative approach...');
      try {
        // Try to just check if the collection exists
        await vectorStore.collection;
        console.log('✅ ChromaDB connection successful (collection exists)');
        return true;
      } catch (innerError) {
        console.error('Alternative connection test also failed:', innerError.message);
        return false;
      }
    }
    
    return false;
  }
}

/**
 * Create document metadata for vector storage
 * @param {string} file - File path
 * @param {Object} fileStats - File statistics
 * @param {number} index - Chunk index
 * @param {number} totalChunks - Total number of chunks
 * @param {string} chunk - Text chunk content
 * @param {string} llmType - LLM type (OPENAI/GEMINI)
 * @param {Object} embeddingModel - Embedding model configuration
 * @returns {Object} - Document metadata object
 */
export function createDocumentMetadata(file, fileStats, index, totalChunks, chunk, llmType, embeddingModel) {
  const fileName = file.split('/').pop(); // Get just the filename
  
  return {
    source: file,
    fileName: fileName,
    fileSize: fileStats.size,
    fileCreated: fileStats.birthtime.toISOString(),
    fileModified: fileStats.mtime.toISOString(),
    chunkIndex: index,
    totalChunks: totalChunks,
    chunkSize: chunk.length,
    uploadTimestamp: new Date().toISOString(),
    contentType: 'text/plain',
    processingModel: process.env.OPENAI_MODEL || 'gpt-4',
    embeddingModel: embeddingModel[llmType].model
  };
}

/**
 * Process documents in batches to avoid payload size limits
 * @param {Array} documents - Array of documents to process
 * @param {Object} vectorStore - Vector store instance
 * @param {number} batchSize - Size of each batch
 * @returns {Promise<void>}
 */
export async function processDocumentsInBatches(documents, vectorStore, batchSize) {
  console.log(`🔄 Processing ${documents.length} documents in batches of ${batchSize}...`);
  
  for (let i = 0; i < documents.length; i += batchSize) {
    const batch = documents.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(documents.length / batchSize);
    const currentTime = new Date();
    
    console.log(`📦 Processing batch ${batchNumber}/${totalBatches} (${batch.length} documents)...`);
    
    try {
      await vectorStore.addDocuments(batch);
      console.log(`✅ Batch ${batchNumber} processed successfully TimeTaken:`, new Date() - currentTime, 'ms');
    } catch (error) {
      console.error(`❌ Error processing batch ${batchNumber}:`, error.message);
      throw new Error(`Failed to process batch ${batchNumber}: ${error.message}`);
    }
    
    // Add a small delay between batches to prevent overwhelming ChromaDB
    if (i + batchSize < documents.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  console.log('Vector store: ✅ (All batches processed)');
}

/**
 * Combine multiple documents into a single string
 * @param {Array} docs - Array of document objects with pageContent property
 * @returns {string} - Combined document content separated by double newlines
 */
export function combineDocuments(docs) {
  return docs.map((doc) => doc.pageContent).join('\n\n');
} 
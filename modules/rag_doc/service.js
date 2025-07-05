import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { Document } from "@langchain/core/documents";
import { Chroma } from "@langchain/community/vectorstores/chroma";

import { createClient } from "@supabase/supabase-js";

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";

import * as prompts from './prompts.js';
import fs from 'fs/promises';
import * as dotenv from 'dotenv';
import { LLM_TYPE } from './constants.js';

// Load environment variables
dotenv.config();

class RagService {
  constructor() {
    const LLM = LLM_TYPE.OPENAI;
    this.userContext = [];
    this.standaloneQueryPrompt = prompts.default.standaloneQueryPrompt;
    this.userQueryPrompt = prompts.default.userQueryPrompt;
    this.outputParser = new StringOutputParser();
    this.initializeLLMModel(LLM);
    this.initializeEmbeddings(LLM);
    // this.initializeSupabase();
    this.initializeChromaDB();
    this.initializeTextSplitter();
  }

  // Create new Document and Create Vector Store
  async uploadDocumentAndCreateVectorStore(file) {
    const fileContent = await fs.readFile(file, 'utf8');
    const chunks = await this.textSplitter.splitText(fileContent);
    // console.log('Chunks:', chunks);
    
    // Get file stats for metadata
    const fileStats = await fs.stat(file);
    const fileName = file.split('/').pop(); // Get just the filename
    
    // Convert text chunks to Document objects with rich metadata
    const documents = chunks.map((chunk, index) => new Document({ 
      pageContent: chunk,
      metadata: { 
        source: file,
        fileName: fileName,
        // fileSize: fileStats.size,
        fileCreated: fileStats.birthtime.toISOString(),
        fileModified: fileStats.mtime.toISOString(),
        chunkIndex: index,
        totalChunks: chunks.length,
        // chunkSize: chunk.length,
        // uploadTimestamp: new Date().toISOString(),
        // contentType: 'text/plain',
        // processingModel: process.env.OPENAI_MODEL || 'gpt-4.1-nano',
        // embeddingModel: 'text-embedding-3-small'
      }
    }));
    
    const vectorStore = await this.vectorStore.addDocuments(documents);
    return vectorStore;
  }

  // Execute User query
  async executeUserQuery(query) {
    console.log('User context:', this.userContext);
    this.userContext.push(`User: ${query}`);
    const chain = this.standaloneQueryPrompt.pipe(this.model).pipe(this.outputParser);
    const response = await chain.invoke({ question: query, context: JSON.stringify(this.userContext) });
    const searchQuery =  String(response);
    console.log('Search query:', searchQuery);
    const nearestVector = await this.vectorStore.similaritySearch(searchQuery, 4);
    // this.consoleLog(nearestVector, true);
    this.userContext.push(`Assistant: User is asking    ${response}`);
    const chain2 = this.userQueryPrompt.pipe(this.model).pipe(this.outputParser);
    const response2 = await chain2.invoke({ question: query, context: JSON.stringify(response), history: JSON.stringify(this.userContext) });
    this.userContext.push(`Assistant: ${response2}`);
    console.log('User context:', this.userContext);
    return response2; 
  }

  consoleLog(message, debug = false) {
    if (debug) {
      console.log(message);
    }
  }

  initializeTextSplitter() {
    this.textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: process.env.TEXT_SPLITTER_CHUNK_SIZE,
      chunkOverlap: process.env.TEXT_SPLITTER_CHUNK_OVERLAP,
      separators: ["\n\n", "\n", " ", ".", "?", "!", ";"],
    });
  }

  initializeLLMModel(LLM_TYPE) {
    if (LLM_TYPE === "OPENAI") {
      this.model = new ChatOpenAI({ modelName: process.env.OPENAI_MODEL });   // this is paid model
    } else if (LLM_TYPE === "GEMINI") {
      this.model = new ChatGoogleGenerativeAI({ model: process.env.GEMINI_MODEL, maxOutputTokens: 2048 });
    }
  }

  initializeEmbeddings(LLM_TYPE) {
    this.embeddings = new OpenAIEmbeddings({      // this is paid model
      model: "text-embedding-3-small",
    });
    // this.embeddings = new GoogleGenerativeAIEmbeddings({
    //         modelName: "gemini-embedding-exp-03-07",  
    // });
  }

  initializeSupabase() {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PRIVATE_KEY);
    this.vectorStore = new SupabaseVectorStore(this.embeddings, {
      client: supabase,
      tableName: process.env.SUPABASE_DOCUMENT_VECTOR_TABLE,
      queryName: "match_documents",
    });
  }

  initializeChromaDB() {
        // Parse ChromaDB URL to extract host and port
        const chromaUrl = process.env.CHROMA_URL;
        const url = new URL(chromaUrl);
        
        try {
          this.vectorStore = new Chroma(this.embeddings, {
            collectionName: process.env.CHROMA_COLLECTION_NAME ,
            host: url.hostname,
            port: parseInt(url.port) || (url.protocol === 'https:' ? 443 : 80),
            ssl: url.protocol === 'https:',
            collectionMetadata: {
              "hnsw:space": "cosine"
            }
          });
        } catch (error) {
          console.error('Failed to initialize ChromaDB vector store:', error);
          throw new Error(`ChromaDB connection failed. Please ensure ChromaDB server is running at ${chromaUrl}`);
        }
  }

  // Test ChromaDB connection
  async testChromaConnection() {
    try {
      // Test basic connection by trying to access the collection
      const collection = await this.vectorStore.collection;
      console.log('✅ ChromaDB collection accessed successfully');
      
      // Try a simple similarity search with a basic query
      const results = await this.vectorStore.similaritySearch("test", 1);
      console.log('✅ ChromaDB search successful');
      return true;
    } catch (error) {
      console.error('ChromaDB connection test failed:', error);
      
      // If the error is about embeddings, try a different approach
      if (error.message.includes('every is not a function') || error.message.includes('embedding')) {
        console.log('⚠️  Embedding format issue detected. Trying alternative approach...');
        try {
          // Try to just check if the collection exists
          await this.vectorStore.collection;
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

}

export const RagDocService = new RagService(); 
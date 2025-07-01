import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
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

// Load environment variables
dotenv.config();

class RagService {
  constructor() {
    this.userContext = [];
    this.standaloneQueryPrompt = prompts.default.standaloneQueryPrompt;
    this.userQueryPrompt = prompts.default.userQueryPrompt;
    this.model = new ChatOpenAI({ modelName: process.env.OPENAI_MODEL });
    // this.model = new ChatGoogleGenerativeAI({ model: process.env.GEMINI_MODEL, maxOutputTokens: 2048 });
    this.outputParser = new StringOutputParser();
    this.embeddings = new OpenAIEmbeddings({
      model: "text-embedding-3-small",
    });
    
    
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_PRIVATE_KEY) {
      throw new Error('Missing required environment variables: SUPABASE_URL and SUPABASE_PRIVATE_KEY');
    }
    
    this.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PRIVATE_KEY);
    // this.vectorStore = new SupabaseVectorStore(this.embeddings, {
    //   client: this.supabase,
    //   tableName: process.env.SUPABASE_DOCUMENT_VECTOR_TABLE,
    //   queryName: "match_documents",
    // });
    this.vectorStore = new Chroma(this.embeddings, {
      collectionName: process.env.CHROMA_COLLECTION_NAME,
      url: process.env.CHROMA_URL,
    });
    this.textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: process.env.TEXT_SPLITTER_CHUNK_SIZE,
      chunkOverlap: process.env.TEXT_SPLITTER_CHUNK_OVERLAP,
      separators: ["\n\n", "\n", " ", ".", "?", "!", ";"],
    });
  }

  // Create new Document and Create Vector Store
  async uploadDocumentAndCreateVectorStore(file) {
    const fileContent = await fs.readFile(file, 'utf8');
    const chunks = await this.textSplitter.splitText(fileContent);
    
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
    const nearestVector = await this.vectorStore.similaritySearch(searchQuery, 3);
    this.consoleLog(nearestVector, true);
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

}

export const RagDocService = new RagService(); 
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { Document } from "@langchain/core/documents";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
// import { combineDocuments } from "@langchain/core/documents";

import * as prompts from './prompts.js';
import fs from 'fs/promises';
import * as dotenv from 'dotenv';
import { LLM_TYPE, EMBEDDING_MODEL } from './constants.js';
import RagInitializer from './initializer.js';
import { consoleLog, testChromaConnection, createDocumentMetadata, processDocumentsInBatches } from './utils.js';

// Load environment variables
dotenv.config();

class RagService {
  constructor() {
    this.llmType = LLM_TYPE.OPENAI;
    this.userContext = [];
    this.standaloneQueryPrompt = prompts.default.standaloneQueryPrompt;
    this.userQueryPrompt = prompts.default.userQueryPrompt;
    this.outputParser = new StringOutputParser();
    this.debug = process.env.DEBUG;
    
    // Initialize components using the initializer
    const initializer = new RagInitializer(this.llmType);
    this.model = initializer.initializeLLMModel();
    this.embeddings = initializer.initializeEmbeddings();
    this.vectorStore = initializer.initializeChromaDB(this.embeddings);
    this.textSplitter = initializer.initializeTextSplitter();
  }

  // Create new Document and Create Vector Store
  async uploadDocumentAndCreateVectorStore(file) {
    let currentTime = new Date();
    const fileContent = await fs.readFile(file, 'utf8');
    consoleLog(`File content: ✅ TimeTaken:${(new Date() - currentTime)}ms`, this.debug);
    currentTime = new Date();
    const chunks = await this.textSplitter.splitText(fileContent);
    consoleLog(`Chunks: ✅ (${chunks.length} chunks created) TimeTaken:${(new Date() - currentTime)}ms`, this.debug);
    currentTime = new Date();
    
    // Get file stats for metadata
    const fileStats = await fs.stat(file);
    
    // Convert text chunks to Document objects with rich metadata using utility function
    const documents = chunks.map((chunk, index) => new Document({ 
      pageContent: chunk,
      metadata: createDocumentMetadata(file, fileStats, index, chunks.length, chunk, this.llmType, EMBEDDING_MODEL)
    }));
    consoleLog(`Documents: ✅ TimeTaken:${(new Date() - currentTime)}ms`, this.debug);
    currentTime = new Date();
    
    // Process documents in batches using utility function
    const BATCH_SIZE = parseInt(process.env.BATCH_SIZE);
    await processDocumentsInBatches(documents, this.vectorStore, BATCH_SIZE);
    
    return this.vectorStore;
  }

  // Execute User query
  async executeUserQuery(query) {
    consoleLog('User context:\n'+ JSON.stringify(this.userContext, null, 2), this.debug);
    this.userContext.push(`User: ${query}`);
    const chain = this.standaloneQueryPrompt.pipe(this.model).pipe(this.outputParser);
    const response = await chain.invoke({ question: query, context: JSON.stringify(this.userContext) });
    const searchQuery =  String(response);
    consoleLog('Search query:'+ searchQuery, this.debug);
    const nearestVector = await this.vectorStore.similaritySearch(searchQuery, 4);
    // consoleLog(nearestVector, this.debug); // Using utility function for debug logging
    this.userContext.push(`Assistant: User is asking    ${response}`);
    const chain2 = this.userQueryPrompt.pipe(this.model).pipe(this.outputParser);
    const response2 = await chain2.invoke({ question: query, context: JSON.stringify(response), history: JSON.stringify(this.userContext) });
    this.userContext.push(`Assistant: ${response2}`);
    consoleLog('User context:\n'+ JSON.stringify(this.userContext, null, 2), this.debug);
    return response2; 
  }

  // async executeStandaloneQueryViaRunnableSequence (query) {
  //   const retriever = this.vectorStore.asRetriever();
  //   const standaloneQuestionchain = this.standaloneQueryPrompt
  //     .pipe(this.model)
  //     .pipe(this.outputParser);
  //   const retrieverChain = RunnableSequence.from([
  //     prevRes => { return prevRes.standAloneQuestion },
  //     retriever,
  //     combineDocuments
  //   ]);
  //   const answerChain = this.userQueryPrompt
  //     .pipe(this.model)
  //     .pipe(this.outputParser);
  //   const chain = RunnableSequence.from([
  //     { standAloneQuestion: standaloneQuestionchain,
  //       originalInput: new RunnablePassthrough()
  //     },
  //     {
  //       context: retrieverChain,
  //       question: standAloneQuestion
  //     },
  //     answerChain
  //   ]);
  //   const response = await chain.invoke({ question: query, context: JSON.stringify(this.userContext) });
  //   return response;
  // }

  // Test ChromaDB connection using utility function
  async testChromaConnection() {
    return await testChromaConnection(this.vectorStore);
  }
}

export const RagDocService = new RagService();
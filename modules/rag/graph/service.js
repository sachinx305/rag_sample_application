import { Document } from "@langchain/core/documents";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";

import fs from "fs/promises";
import * as dotenv from "dotenv";

import * as prompts from "./prompts.js";
import { LLM_TYPE, EMBEDDING_MODEL } from "../constants.js";
import RagInitializer from "../initializer.js";
import {
  consoleLog,
  testChromaConnection,
  createDocumentMetadata,
  processDocumentsInBatches,
  combineDocuments,
} from "../chains/utils.js";

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

  async executeRagGraph(query) {
    this.userContext.push(`User: ${query}`);
  }   
}

export const RagGraphService = new RagService();

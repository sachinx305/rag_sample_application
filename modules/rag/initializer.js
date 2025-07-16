import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import { LLM_TYPE, EMBEDDING_MODEL, VECTOR_STORE } from "./constants.js";
import dotenv from "dotenv";
dotenv.config();

class infraInitializer {
  constructor() {
    this.llmType = LLM_TYPE.OPENAI;
    this.vectorStore = VECTOR_STORE.SUPABASE;
  }

  initializeTextSplitter() {
    return new RecursiveCharacterTextSplitter({
      chunkSize: process.env.TEXT_SPLITTER_CHUNK_SIZE,
      chunkOverlap: process.env.TEXT_SPLITTER_CHUNK_OVERLAP,
      separators: ["\n\n", "\n", " ", ".", "?", "!", ";"],
    });
  }

  getLLMType() {
    return this.llmType;
  }

  getvectorStore() {
    let vectorStore;
    this.embeddings = this.initializeEmbeddings();
    if (this.vectorStore === VECTOR_STORE.CHROMA) {
      vectorStore = this.initializeChromaDB(this.embeddings);
    } else if (this.vectorStore === VECTOR_STORE.SUPABASE) {
      vectorStore = this.initializeSupabase(this.embeddings);
    }
    return vectorStore;
  }

  initializeLLMModel(deterministic = false) {
    const llmType = this.getLLMType();
    if (llmType === LLM_TYPE.OPENAI) {
      return new ChatOpenAI({ 
        modelName: process.env.OPENAI_MODEL, 
        temperature: deterministic ? 0 : 0.5 
      }); // this is paid model
    } else if (llmType === LLM_TYPE.GEMINI) {
      return new ChatGoogleGenerativeAI({
        model: process.env.GEMINI_MODEL,
        maxOutputTokens: 2048,
      });
    }
  }

  initializeEmbeddings() {
    const llmType = this.llmType;
    if (llmType === LLM_TYPE.OPENAI) {
      return new OpenAIEmbeddings({
        model: EMBEDDING_MODEL.OPENAI.model
      });
    } else if (llmType === LLM_TYPE.GEMINI) {
      return new GoogleGenerativeAIEmbeddings({
        modelName: EMBEDDING_MODEL.GEMINI.model
      });
    }
  }

  initializeSupabase(embeddings) {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_PRIVATE_KEY
    );
    return new SupabaseVectorStore(embeddings, {
      client: supabase,
      tableName: process.env.SUPABASE_DOCUMENT_VECTOR_TABLE,
      queryName: "match_documents",
    });
  }

  initializeChromaDB(embeddings) {
    // Parse ChromaDB URL to extract host and port
    const chromaUrl = process.env.CHROMA_URL;
    const url = new URL(chromaUrl);

    try {
      return new Chroma(embeddings, {
        collectionName: process.env.CHROMA_COLLECTION_NAME,
        host: url.hostname,
        port: parseInt(url.port) || (url.protocol === "https:" ? 443 : 80),
        ssl: url.protocol === "https:",
        collectionMetadata: {
          "hnsw:space": "cosine",
        },
      });
    } catch (error) {
      console.error("Failed to initialize ChromaDB vector store:", error);
      throw new Error(
        `ChromaDB connection failed. Please ensure ChromaDB server is running at ${chromaUrl}`
      );
    }
  }
}

export default infraInitializer;

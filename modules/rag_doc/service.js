import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";

import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

import { createClient } from "@supabase/supabase-js";

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";

import { Document } from "@langchain/core/documents";

import fs from 'fs/promises';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

class RagService {
  constructor() {
    this.model = new ChatOpenAI({ modelName: process.env.OPENAI_MODEL });
    this.outputParser = new StringOutputParser();
    this.embeddings = new OpenAIEmbeddings({
      model: "text-embedding-3-small",
    });
    
    
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_PRIVATE_KEY) {
      throw new Error('Missing required environment variables: SUPABASE_URL and SUPABASE_PRIVATE_KEY');
    }
    
    this.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PRIVATE_KEY);
    this.vectorStore = new SupabaseVectorStore(this.embeddings, {
      client: this.supabase,
      tableName: process.env.SUPABASE_DOCUMENT_VECTOR_TABLE,
      queryName: "match_documents",
    });
    this.textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: process.env.TEXT_SPLITTER_CHUNK_SIZE,
      chunkOverlap: process.env.TEXT_SPLITTER_CHUNK_OVERLAP,
    });
  }

  // Get all books
  // async getAllBooks() {
  //   return this.books;
  // }

  // // Get book by ID
  // async getBookById(id) {
  //   return this.books.find(book => book.id === id);
  // }

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

  // // Update book
  // async updateBook(id, updateData) {
  //   const bookIndex = this.books.findIndex(book => book.id === id);
    
  //   if (bookIndex === -1) {
  //     return null;
  //   }

  //   this.books[bookIndex] = {
  //     ...this.books[bookIndex],
  //     ...updateData,
  //     updatedAt: new Date().toISOString()
  //   };

  //   return this.books[bookIndex];
  // }

  // // Delete book
  // async deleteBook(id) {
  //   const bookIndex = this.books.findIndex(book => book.id === id);
    
  //   if (bookIndex === -1) {
  //     return null;
  //   }

  //   const deletedBook = this.books[bookIndex];
  //   this.books.splice(bookIndex, 1);
    
  //   return deletedBook;
  // }

  // // Search books by title, author, or content
  // async searchBooks(query) {
  //   if (!query) {
  //     return this.books;
  //   }

  //   const searchTerm = query.toLowerCase();
    
  //   return this.books.filter(book => 
  //     book.title.toLowerCase().includes(searchTerm) ||
  //     book.author.toLowerCase().includes(searchTerm) ||
  //     book.description.toLowerCase().includes(searchTerm) ||
  //     book.content.toLowerCase().includes(searchTerm) ||
  //     book.genre.toLowerCase().includes(searchTerm)
  //   );
  // }

  // // Get books by genre
  // async getBooksByGenre(genre) {
  //   return this.books.filter(book => 
  //     book.genre.toLowerCase() === genre.toLowerCase()
  //   );
  // }

  // // Get books by author
  // async getBooksByAuthor(author) {
  //   return this.books.filter(book => 
  //     book.author.toLowerCase().includes(author.toLowerCase())
  //   );
  // }

  // // Get books by year range
  // async getBooksByYearRange(startYear, endYear) {
  //   return this.books.filter(book => 
  //     book.year >= startYear && book.year <= endYear
  //   );
  // }
}

export const RagDocService = new RagService(); 
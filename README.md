# RAG Document Processing API

A powerful Express.js server that implements Retrieval-Augmented Generation (RAG) for intelligent document processing and querying. This application uses ChromaDB as a vector store and LangChain for document processing and AI interactions.

## 🚀 Features

- **Document Upload & Processing**: Upload text files and automatically create vector embeddings
- **Intelligent Querying**: Ask questions about uploaded documents using RAG
- **Multi-Model Support**: Choose between OpenAI GPT models or Google Gemini
- **Vector Storage**: ChromaDB integration for efficient similarity search
- **Conversational Context**: Maintains conversation history for contextual responses
- **Batch Processing**: Handles large documents efficiently with configurable batch sizes
- **Rich Metadata**: Tracks comprehensive document and chunk metadata

## 📁 Project Structure

```
rag_sample_application/
├── index.js                    # Main server file
├── package.json               # Dependencies and scripts
├── docker-compose.yml         # ChromaDB container configuration
├── setup-chroma.js           # ChromaDB setup script
├── test-chroma.js            # ChromaDB connection test
├── fix-dependencies.js       # Dependency fix utility
├── modules/
│   └── rag_doc/
│       ├── controller.js      # HTTP request handlers
│       ├── service.js         # RAG business logic
│       ├── routes.js          # API routes
│       ├── constants.js       # LLM and embedding configurations
│       └── prompts.js         # LangChain prompt templates
├── chroma_db/                # ChromaDB data directory
├── db/                       # Database files
└── README.md
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rag_sample_application
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup ChromaDB**
   ```bash
   npm run setup
   ```
   This will:
   - Check if Docker is installed
   - Create a `docker-compose.yml` file for ChromaDB
   - Create a `.env` file with default configuration
   - Start ChromaDB in a Docker container

## ⚙️ Environment Configuration

Update the `.env` file with your API keys:

```env
# ChromaDB Configuration
CHROMA_URL=http://localhost:8000
CHROMA_COLLECTION_NAME=documents

# OpenAI Configuration (required for OpenAI models)
OPENAI_MODEL=gpt-4o-mini
OPENAI_API_KEY=your_openai_api_key_here

# Gemini Configuration (alternative to OpenAI)
GEMINI_MODEL=gemini-1.5-flash
GOOGLE_API_KEY=your_google_api_key_here

# Text Processing Configuration
TEXT_SPLITTER_CHUNK_SIZE=1000
TEXT_SPLITTER_CHUNK_OVERLAP=200

# File Upload Configuration
MAX_FILE_SIZE=52428800
LARGE_FILE_THRESHOLD=10485760
BATCH_SIZE=25
MULTER_DEST=./uploads

# Supabase Configuration (optional, for Supabase vector store)
SUPABASE_URL=your_supabase_url_here
SUPABASE_PRIVATE_KEY=your_supabase_private_key_here
SUPABASE_DOCUMENT_VECTOR_TABLE=documents
```

## 🚀 Running the Application

1. **Start the server**
   ```bash
   npm start
   ```
   The server will start on port 3000 (or the port specified in your environment variables).

2. **Test ChromaDB connection**
   ```bash
   npm run test-chroma
   ```

3. **Development mode (with auto-restart)**
   ```bash
   npm run dev
   ```

## 📡 API Endpoints

### Health Check
- **GET** `/health` - Check if server is running

### Document Processing API

Base URL: `/api/rag-doc`

#### Upload Document
- **POST** `/api/rag-doc`
- **Content-Type**: `multipart/form-data`
- **Body**: 
  - `file`: Text file (.txt only, max 50MB)
- **Description**: Uploads a text document, processes it into chunks, creates embeddings, and stores them in ChromaDB
- **Response**: Document processing status and metadata

#### Query Documents
- **POST** `/api/rag-doc/query`
- **Content-Type**: `application/json`
- **Body**: 
  ```json
  {
    "query": "Your question about the uploaded documents"
  }
  ```
- **Description**: Queries the uploaded documents using RAG to provide intelligent responses
- **Response**: AI-generated answer based on document content

## 📝 Example Usage

### Upload a document
```bash
curl -X POST http://localhost:3000/api/rag-doc \
  -F "file=@your_document.txt"
```

### Query uploaded documents
```bash
curl -X POST http://localhost:3000/api/rag-doc/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What are the main topics discussed in the uploaded documents?"
  }'
```

### Check server health
```bash
curl http://localhost:3000/health
```

## 🔧 Configuration Options

### Text Processing
- `TEXT_SPLITTER_CHUNK_SIZE`: Size of text chunks (default: 1000 characters)
- `TEXT_SPLITTER_CHUNK_OVERLAP`: Overlap between chunks (default: 200 characters)
- `BATCH_SIZE`: Number of documents to process in each batch (default: 25)

### File Upload
- `MAX_FILE_SIZE`: Maximum file size in bytes (default: 50MB)
- `LARGE_FILE_THRESHOLD`: Threshold for large file processing (default: 10MB)
- `MULTER_DEST`: Temporary upload directory (default: ./uploads)

### AI Models
- **OpenAI**: Uses GPT-4o-mini by default
- **Gemini**: Uses gemini-1.5-flash by default
- **Embeddings**: text-embedding-3-small (OpenAI) or gemini-embedding-exp-03-07 (Gemini)

## 🐳 Docker Management

### Start ChromaDB
```bash
docker-compose up -d
```

### Stop ChromaDB
```bash
docker-compose down
```

### View ChromaDB logs
```bash
docker-compose logs chroma
```

## 🔍 Troubleshooting

### Dependency Issues
If you encounter embedding format errors, run:
```bash
npm run fix-deps
```

### ChromaDB Connection Issues
1. Ensure Docker is running
2. Check if ChromaDB container is up: `docker ps`
3. Test connection: `npm run test-chroma`
4. Restart ChromaDB: `docker-compose restart`

### File Upload Issues
- Ensure files are `.txt` format only
- Check file size limits in `.env`
- Verify upload directory permissions

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "message": "Operation failed"
}
```

## 🧠 How It Works

1. **Document Upload**: Text files are uploaded and read
2. **Text Splitting**: Documents are split into manageable chunks using RecursiveCharacterTextSplitter
3. **Embedding Generation**: Each chunk is converted to vector embeddings using OpenAI or Gemini
4. **Vector Storage**: Embeddings are stored in ChromaDB with rich metadata
5. **Query Processing**: User queries are processed through a two-stage RAG pipeline:
   - **Standalone Query Generation**: Converts conversational queries to standalone search queries
   - **Context-Aware Response**: Generates responses using retrieved context and conversation history

## 🔮 Future Enhancements

- [ ] Support for multiple file formats (PDF, DOCX, etc.)
- [ ] Web interface for document upload and querying
- [ ] User authentication and document ownership
- [ ] Advanced search filters and pagination
- [ ] Real-time document collaboration
- [ ] Integration with additional vector stores
- [ ] Custom prompt templates
- [ ] Document versioning and history

## 📄 License

ISC License - see package.json for details

## 👨‍💻 Author

Sachin Saini

---

**Note**: This application requires API keys for OpenAI or Google Gemini to function. Make sure to configure your `.env` file with valid API keys before running the application. 
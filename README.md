# RAG Book API

A simple Express server with a modular structure for managing books with RAG (Retrieval-Augmented Generation) capabilities.

## Project Structure

```
RAG_1/
├── index.js                 # Main server file
├── package.json
├── modules/
│   └── rag_book/
│       ├── controller.js    # HTTP request handlers
│       ├── service.js       # Business logic
│       └── routes.js        # API routes
└── README.md
```

## Installation

```bash
npm install
```

## Running the Server

```bash
npm start
```

The server will start on port 3000 (or the port specified in your environment variables).

## API Endpoints

### Health Check
- **GET** `/health` - Check if server is running

### Books API

Base URL: `/api/rag-doc`

#### Get All Books
- **GET** `/api/rag-doc`
- Returns all books in the system

#### Get Book by ID
- **GET** `/api/rag-doc/:id`
- Returns a specific book by its ID

#### Search Books
- **GET** `/api/rag-doc/search?query=search_term`
- Search books by title, author, description, content, or genre

#### Create New Book
- **POST** `/api/rag-doc`
- Body: `{ "title": "Book Title", "author": "Author Name", "genre": "Genre", "year": 2023, "description": "Book description", "content": "Book content" }`

#### Update Book
- **PUT** `/api/rag-doc/:id`
- Body: `{ "title": "Updated Title", "author": "Updated Author", ... }`

#### Delete Book
- **DELETE** `/api/rag-doc/:id`
- Deletes a book by its ID

## Example Usage

### Get all books
```bash
curl http://localhost:3000/api/rag-doc
```

### Search for books
```bash
curl http://localhost:3000/api/rag-doc/search?query=fitzgerald
```

### Create a new book
```bash
curl -X POST http://localhost:3000/api/rag-doc \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Pride and Prejudice",
    "author": "Jane Austen",
    "genre": "Romance",
    "year": 1813,
    "description": "A classic romance novel",
    "content": "It is a truth universally acknowledged..."
  }'
```

### Get a specific book
```bash
curl http://localhost:3000/api/rag-doc/1
```

### Update a book
```bash
curl -X PUT http://localhost:3000/api/rag-doc/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Book Title"
  }'
```

### Delete a book
```bash
curl -X DELETE http://localhost:3000/api/rag-doc/1
```

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": [...],
  "message": "Operation completed successfully"
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message",
  "message": "Operation failed"
}
```

## Features

- **Modular Architecture**: Clean separation of concerns with controller, service, and routes
- **RESTful API**: Standard HTTP methods for CRUD operations
- **Search Functionality**: Search across multiple book fields
- **Error Handling**: Comprehensive error handling and status codes
- **In-Memory Storage**: Demo data with sample books (can be replaced with database)

## Future Enhancements

- Database integration (MongoDB, PostgreSQL, etc.)
- Authentication and authorization
- File upload for book content
- Advanced search with filters
- Pagination for large datasets
- RAG integration for intelligent book recommendations 
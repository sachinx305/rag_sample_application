import express from 'express';
import { RagDocController } from './controller.js';

const router = express.Router();

// // GET /api/rag-doc - Get all books
// router.get('/', RagDocController.getAllBooks);

// // GET /api/rag-doc/search - Search books
// router.get('/search', RagDocController.searchBooks);

// // GET /api/rag-doc/:id - Get book by ID
// router.get('/:id', RagDocController.getBookById);

// POST /api/rag-doc - Create new book
router.post('/', RagDocController.uploadDocumentAndCreateVectorStore.bind(RagDocController));

// // PUT /api/rag-doc/:id - Update book
// router.put('/:id', RagDocController.updateBook);

// // DELETE /api/rag-doc/:id - Delete book
// router.delete('/:id', RagDocController.deleteBook);

export default router; 
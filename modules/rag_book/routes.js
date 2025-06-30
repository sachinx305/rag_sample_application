import express from 'express';
import { ragBookController } from './controller.js';

const router = express.Router();

// GET /api/rag-book - Get all books
router.get('/', ragBookController.getAllBooks);

// GET /api/rag-book/search - Search books
router.get('/search', ragBookController.searchBooks);

// GET /api/rag-book/:id - Get book by ID
router.get('/:id', ragBookController.getBookById);

// POST /api/rag-book - Create new book
router.post('/', ragBookController.createBook);

// PUT /api/rag-book/:id - Update book
router.put('/:id', ragBookController.updateBook);

// DELETE /api/rag-book/:id - Delete book
router.delete('/:id', ragBookController.deleteBook);

export default router; 
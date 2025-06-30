import { ragBookService } from './service.js';

class RagBookController {
  // Get all books
  async getAllBooks(req, res) {
    try {
      const books = await ragBookService.getAllBooks();
      res.status(200).json({
        success: true,
        data: books,
        message: 'Books retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        message: 'Failed to retrieve books'
      });
    }
  }

  // Get book by ID
  async getBookById(req, res) {
    try {
      const { id } = req.params;
      const book = await ragBookService.getBookById(id);
      
      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Book not found'
        });
      }

      res.status(200).json({
        success: true,
        data: book,
        message: 'Book retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        message: 'Failed to retrieve book'
      });
    }
  }

  // Create new book
  async createBook(req, res) {
    try {
      const bookData = req.body;
      const newBook = await ragBookService.createBook(bookData);
      
      res.status(201).json({
        success: true,
        data: newBook,
        message: 'Book created successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        message: 'Failed to create book'
      });
    }
  }

  // Update book
  async updateBook(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedBook = await ragBookService.updateBook(id, updateData);
      
      if (!updatedBook) {
        return res.status(404).json({
          success: false,
          message: 'Book not found'
        });
      }

      res.status(200).json({
        success: true,
        data: updatedBook,
        message: 'Book updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        message: 'Failed to update book'
      });
    }
  }

  // Delete book
  async deleteBook(req, res) {
    try {
      const { id } = req.params;
      const deletedBook = await ragBookService.deleteBook(id);
      
      if (!deletedBook) {
        return res.status(404).json({
          success: false,
          message: 'Book not found'
        });
      }

      res.status(200).json({
        success: true,
        data: deletedBook,
        message: 'Book deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        message: 'Failed to delete book'
      });
    }
  }

  // Search books
  async searchBooks(req, res) {
    try {
      const { query } = req.query;
      const books = await ragBookService.searchBooks(query);
      
      res.status(200).json({
        success: true,
        data: books,
        message: 'Search completed successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        message: 'Failed to search books'
      });
    }
  }
}

export const ragBookController = new RagBookController(); 
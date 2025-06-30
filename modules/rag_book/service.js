class RagBookService {
  constructor() {
    // In-memory storage for demo purposes
    // In a real application, this would be replaced with a database
    this.books = [
      {
        id: '1',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        genre: 'Fiction',
        year: 1925,
        description: 'A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
        content: 'In my younger and more vulnerable years my father gave me some advice that I\'ve been turning over in my mind ever since...'
      },
      {
        id: '2',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        genre: 'Fiction',
        year: 1960,
        description: 'The story of young Scout Finch and her father Atticus in a racially divided Alabama town.',
        content: 'When he was nearly thirteen, my brother Jem got his arm badly broken at the elbow...'
      },
      {
        id: '3',
        title: '1984',
        author: 'George Orwell',
        genre: 'Dystopian Fiction',
        year: 1949,
        description: 'A dystopian novel about totalitarianism and surveillance society.',
        content: 'It was a bright cold day in April, and the clocks were striking thirteen...'
      }
    ];
  }

  // Get all books
  async getAllBooks() {
    return this.books;
  }

  // Get book by ID
  async getBookById(id) {
    return this.books.find(book => book.id === id);
  }

  // Create new book
  async createBook(bookData) {
    const newBook = {
      id: (this.books.length + 1).toString(),
      ...bookData,
      createdAt: new Date().toISOString()
    };
    
    this.books.push(newBook);
    return newBook;
  }

  // Update book
  async updateBook(id, updateData) {
    const bookIndex = this.books.findIndex(book => book.id === id);
    
    if (bookIndex === -1) {
      return null;
    }

    this.books[bookIndex] = {
      ...this.books[bookIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return this.books[bookIndex];
  }

  // Delete book
  async deleteBook(id) {
    const bookIndex = this.books.findIndex(book => book.id === id);
    
    if (bookIndex === -1) {
      return null;
    }

    const deletedBook = this.books[bookIndex];
    this.books.splice(bookIndex, 1);
    
    return deletedBook;
  }

  // Search books by title, author, or content
  async searchBooks(query) {
    if (!query) {
      return this.books;
    }

    const searchTerm = query.toLowerCase();
    
    return this.books.filter(book => 
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm) ||
      book.description.toLowerCase().includes(searchTerm) ||
      book.content.toLowerCase().includes(searchTerm) ||
      book.genre.toLowerCase().includes(searchTerm)
    );
  }

  // Get books by genre
  async getBooksByGenre(genre) {
    return this.books.filter(book => 
      book.genre.toLowerCase() === genre.toLowerCase()
    );
  }

  // Get books by author
  async getBooksByAuthor(author) {
    return this.books.filter(book => 
      book.author.toLowerCase().includes(author.toLowerCase())
    );
  }

  // Get books by year range
  async getBooksByYearRange(startYear, endYear) {
    return this.books.filter(book => 
      book.year >= startYear && book.year <= endYear
    );
  }
}

export const ragBookService = new RagBookService(); 
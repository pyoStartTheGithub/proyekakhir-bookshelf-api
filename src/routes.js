const {
  addBookHandler,
  getAllBooksHandler,
  getAllBooksIdHandler,
  editBooksHandler,
  deleteBooksHandler,
} = require('./handler');

const routes = [
  // untuk menyimpan buku
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },

  // untuk menampilkan seluruh buku
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler,
  },

  // untuk dapat menampilkan detail buku
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getAllBooksIdHandler,
  },

  // untuk dapat mengubah data buku
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBooksHandler,
  },

  // untuk dapat menghapus buku
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBooksHandler,
  },

];

module.exports = routes;

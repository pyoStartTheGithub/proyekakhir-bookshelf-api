const { nanoid } = require('nanoid');
const bookshelf = require('./books');

// untuk menyimpan buku
// eslint-disable-next-line consistent-return
const addBookHandler = (request, h) => {
  // body request
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);

  const finished = pageCount === readPage;

  // menampilkan waktu menyimpan dan update
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  // respon gagal saat client tidak melampirkan properti name pada request body
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  // respon gagal readPage lebih besar dari  pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  // respon buku berhasil dimasukkan
  bookshelf.push(newBook);

  const isSuccess = bookshelf.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });

    response.code(201);
    return response;
  }
};

// untuk menampilkan seluruh buku
const getAllBooksHandler = (request, h) => {
  // request body
  const {
    name,
    reading,
    finished,
  } = request.query;

  if (name !== undefined) {
    const book1 = bookshelf.filter(
      (buku1) => buku1.name.toLowerCase().includes(name.toLowerCase()),
    );

    const response = h.response({
      status: 'success',
      data: {
        bookshelf: book1.map((b) => ({
          id: b.id,
          name: b.name,
          publisher: b.publisher,
        })),
      },
    });

    response.code(200);
    return response;
  }

  if (reading !== undefined) {
    const book2 = bookshelf.filter(
      (buku2) => Number(buku2.reading) === Number(reading),
    );

    const response = h.response({
      status: 'success',
      data: {
        bookshelf: book2.map((b2) => ({
          id: b2.id,
          name: b2.name,
          publisher: b2.publisher,
        })),
      },
    });

    response.code(200);
    return response;
  }

  if (finished !== undefined) {
    const book3 = bookshelf.filter(
      (buku3) => Number(buku3.finished) === Number(finished),
    );

    const response = h.response({
      status: 'success',
      data: {
        bookshelf: book3.map((b3) => ({
          id: b3.id,
          name: b3.name,
          publisher: b3.publisher,
        })),
      },
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      bookshelf: bookshelf.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });

  response.code(200);
  return response;
};

// untuk menampilkan detail buku
const getAllBooksIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = bookshelf.filter((b) => b.id === bookId)[0];

  // untuk memastikan buku tidak undefined
  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });

  response.code(404);
  return response;
};

// untuk dapat mengubah data buku
const editBooksHandler = (request, h) => {
  const { bookId } = request.params;

  // menampilkan body request
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // nilai saat diperbaharui
  const updatedAt = new Date().toISOString();

  // finished
  const finished = pageCount === readPage;

  const index = bookshelf.findIndex((book) => book.id === bookId);

  // Client tidak melampirkan properti name pada request body
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  // Client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount.
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  // Id yang dilampirkan oleh client tidak ditemukkan oleh server
  if (index !== -1) {
    bookshelf[index] = {
      ...bookshelf[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
    };

    // response Bila buku berhasil diperbarui
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });

    response.code(200);
    return response;
  }

  // response dari id yang tidak ditemukan
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

// untuk dapat delete buku
const deleteBooksHandler = (request, h) => {
  const { bookId } = request.params;

  const index = bookshelf.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    bookshelf.splice(index, 1);

    // Bila id dimiliki oleh salah satu buku
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });

    response.code(200);
    return response;
  }

  // Bila id yang dilampirkan tidak dimiliki oleh buku manapun
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

// ekspor objek
module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getAllBooksIdHandler,
  editBooksHandler,
  deleteBooksHandler,
};

const { nanoid } = require('nanoid');
const books = require('./books')

const addBookHandler = (request, h) => {
    const { 
        name, year, author, summary,
        publisher, pageCount, readPage,
        reading } = request.payload

    const id = nanoid(16); 
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt
    const finished = pageCount === readPage;
    const newBook = {
        id, name, year, author, summary,
        publisher, pageCount, readPage,
        reading, finished, insertedAt, updatedAt
    }

    if (!name) {
    // apabila tidak dilampirkan nama buku
    const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku'
    });
    response.code(400);
    return response;
    }

    if (readPage > pageCount) {
    // gagal apabila halaman yang dibaca lebih besar dari jumlah pagenya
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        });
        response.code(400);
        return response;
        }


    books.push(newBook)

    // apabila sukses ditambahkan
    const isSuccess = books.filter((books) => books.id === id).length > 0
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
        
        const response = h.response({
            status: 'fail',
            message: 'Buku gagal ditambahkan',
        });
        response.code(500);
        return response;
}

const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;

    if( name == null && reading == null && finished == null ) {
    // jika query kosong
        const response = h.response({
            status:'success',
            data:{
                books: books.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher
                })),
            }
        })
        response.code(200);
        return response;
    }

    if(name) {
        const filterBooksName = books.filter((book) => {
            // jika terdapat query name
            const nameReg = new RegExp(name,'gi');
            return nameReg.test(book.name);
        });

        const response = h.response({
            status: 'success',
            data: {
                books: filterBooksName.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher
                })),
            },
        })
        response.code(200);
        return response;
    }

    if(reading){
        // jika terdapat query reading
        const filterBooksRead = books.filter((book) => Number(book.reading) === Number(reading));
        const response = h.response({
            status: 'success',
            data: {
                books: filterBooksRead.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher
                })),
            },
        })
        response.code(200);
        return response
    }

    if(finished){
    // jika ada query finished
    const filterBooksFinished = books.filter((book) => Number(book.finished) === Number(finished));
    const response = h.response({
        status: 'success',
        data: {
            books: filterBooksFinished.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher
            }))
        }
    })
    response.code(200);
    return response

    }
}

const getDetailBookHandler = (request, h) => {
    const { bookId } = request.params;
    const book = books.filter((x) => x.id === bookId)[0];

    if(book){
        // apabila id dari buku ditemukan
        const response = h.response({
            status: 'success',
            data: {
                book,
            },
        });
        response.code(200);
        return response;
    }
    // jika tidak ditemukan
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    })
    response.code(404);
    return response;
}

const editBooksByIdhandler = (request, h) => {
    const { bookId } = request.params;
    const{
        name, year, author, summary,
        publisher, pageCount, readPage, reading
    } = request.payload;
    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.id === bookId);

    if( index !== -1 ){
        books[index] = {
            ...books[index],
            name, year, author, summary,
            publisher, pageCount, readPage, reading, updatedAt
        }
        // apabila tidak melampirkan nama bukunya
        if(!name){
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku',
            });
            response.code(400);
            return response;
        }
        // gagal apabila halaman yang dibaca lebih besar dari jumlah pagenya
        if(readPage > pageCount){
            const response = h.response({
                status: 'fail',
                message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
            });
            response.code(400);
            return response;
        }
        
        // apabila berhasil melakukan update buku
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        })
        response.code(200);
        return response;
    }
    // apabila id tidak ditemukan
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
    });
    response.code(404);
    return response;
}

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const index = books.findIndex((book) => book.id === bookId);

    if(index !== -1){
        books.splice(index, 1);

        // apabila id buku ada
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        });
        response.code(200);
        return response;
    }
    // apabila id tidak ada
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
    });
    response.code(404);
    return response;
}

module.exports = { 
    addBookHandler,
    getAllBooksHandler,
    getDetailBookHandler,
    editBooksByIdhandler,
    deleteBookByIdHandler
}
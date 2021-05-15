const { addBookHandler, getAllBooksHandler, getDetailBookHandler, editBooksByIdhandler, deleteBookByIdHandler } = require("./handler");

const routes = [
    {
        method: 'POST', 
        path: '/books',
        handler: addBookHandler
    },
    {
        method: 'GET',
        path: '/books',
        handler: getAllBooksHandler
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: getDetailBookHandler
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: editBooksByIdhandler
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteBookByIdHandler
    }
]

module.exports = routes
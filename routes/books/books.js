const express = require('express');
const router = express.Router();
const axios = require('axios');

// OPEN LIBRARY API DATA TO USE
// docs [
// {
    // - author_name: [a, b, c...]
    // - title:
    // - isbn:
    // - first_publish_year:
    // - cover_i: 
// }
// ]

// MODELS //
const User = require('../../models/user');
const Book = require('../../models/book');

// API URLs //
const searchURL = 'https://openlibrary.org/search.json?q=';
const coverURL = 'https://covers.openlibrary.org/b/id/';

// BOOK SEARCH ROUTES //
router.get('/search', (req, res) => {
    res.render('books/search');
});

router.post('/search', async (req, res) => {
    const { titleSearch } = req.body;

    // Get search results from API
    const response = await axios.get(`${searchURL}${titleSearch}`);
    const books = response.data.docs;
        
    // const searchResult = books.map(book => {
    //     return {
    //         title: book.title,
    //         author: book.author_name,
    //         year: book.first_publish_year,
    //         cover: book.cover_i
    //     };
    // });

    // create a new book object for each element of the search result and push it onto the searchResult array
    const searchResult = [];
    books.forEach(book => {
        const { title, author_name, first_publish_year, cover_i } = book;
        searchResult.push({
            title: title,
            author: author_name,
            year: first_publish_year,
            cover:cover_i
        });
    });
    
    res.render('books/search-results', { searchResult, coverURL });
});

// ADD TO LIBRARY
router.post('/add', async (req, res) => {
    // Check if user is logged in, or redirect to login page
    const currentUser = req.session.userId;
    if (!currentUser) {
        return res.redirect('/users/login');
    }
    const { title, author, year, cover } = req.body;

    // Checks if user already owns this book, skip adding duplicate books
    const check = await Book.findOne({title: title, author: author, owner: currentUser});
    if (check) {
        return res.send('This book is already in your library');
    }

    // Add book data from form (add to library button) to a new document
    const book = new Book({
        title: title,
        author: author,
        year: year,
        cover: cover,
        owner: currentUser
    });

    await book.save();

    // redirect to the user's library page
    res.redirect('/users/library');

});



module.exports = router;
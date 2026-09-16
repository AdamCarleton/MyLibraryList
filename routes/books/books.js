const express = require('express');
const router = express.Router();
const axios = require('axios');

// OPEN LIBRARY API DATA STRUCTURE
// docs [
// {
    // - author_name: [a, b, c...]
    // - title:
    // - isbn:
    // - first_publish_year:
    // - cover_i: 
// }
// ]

// API URLs //
const searchURL = 'https://openlibrary.org/search.json?q=';
const coverURL = 'https://covers.openlibrary.org/b/id/';

// BOOK SEARCH ROUTES //
router.get('/search', (req, res) => {
    res.render('books/search');
});

router.post('/search', async (req, res) => {
    const { titleSearch } = req.body;

    const response = await axios.get(`${searchURL}${titleSearch}`);
    console.log(`${searchURL}${titleSearch}`);
    const books = response.data.docs;
    
    const searchResult = [];
    books.forEach(book => {
        const { title, author_name, first_publish_year, cover_i } = book;
        searchResult.push({
            title: title,
            author: author_name,
            year: first_publish_year,
            cover:cover_i
        });
    })
    res.send(searchResult);
});

module.exports = router;
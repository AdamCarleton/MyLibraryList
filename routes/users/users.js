const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// MODELS //
const User = require('../../models/user');
const Book = require('../../models/book');

// REGISTER ROUTES //
router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Set the fields for the new user to be added into the database
    const user = new User({
        email: req.body.email,
        username: req.body.username,
        password: hashedPassword
    });

    // Save the new user into the database
    await user.save();
    res.redirect('/');
});

// LOGIN ROUTES //
router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({ username: username });

    // If the user does not exist in the database
    if (!user) {
        return res.send('Invalid username or password');
    }

    // Configure session for the user
    req.session.userId = user._id;
    console.log(req.session);

    // compare the input password with the hashedpassword stored in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.send('Invalid username or password');
    } 
    else {
        res.send(`Welcome back ${username}!`);
    }
    
});

// USER LIBRARY ROUTES //
router.get('/library', async (req, res) => {
    const currentUser = req.session.userId;
    if (!currentUser) {
        return res.redirect('/users/login');
    }

    const user = await User.findById(currentUser);

    const books = await Book.find({
        owner: currentUser
    });

    res.render('users/library', { user, books });
    // res.send('You are logged in!');
});

// TEST ROUTE TO VERIFY CORRECT DATABASE RELATIONS //
router.get('/test-book', async (req, res) => {
    // If not logged in redirect to login page
    if (!req.session.userId) {
        return res.redirect('/users/login');
    }

    const book = new Book({
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        cover: 'some image url',
        owner: req.session.userId
    });

    await book.save();

    res.send('Test book added! check mongosh for result');
});

module.exports = router;
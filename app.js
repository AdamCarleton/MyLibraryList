const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const session = require('express-session');
require('dotenv').config();

// DATABASE CONNECTION
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error: ', err);
        process.exit(1);    // Exit process with failure
    }
}

connectDB();

// APP SETUP //
const app = express();
const PORT = 3000;

// EJS //
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MIDDLEWARE //
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

// ROUTER VARIABLES //
const userRoutes = require('./routes/users/users');

// ROUTES //
app.get('/', (req, res) => {
    res.render('home');
})

// USER REGISTRATION //
app.use('/users', userRoutes);

app.listen(PORT, () => {
    console.log(`LISTENING ON PORT ${PORT}`);
})
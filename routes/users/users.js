const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// USER MODEL
const User = require('../../models/user');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
        email: req.body.email,
        username: req.body.username,
        password: hashedPassword
    });

    await user.save();
    res.redirect('/');
});

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({ username: username });

    if (!user) {
        return res.send('Invalid username or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.send('Invalid username or password');
    } 
    else {
        res.send(`Welcome back ${username}!`);
    }
    

});

module.exports = router;
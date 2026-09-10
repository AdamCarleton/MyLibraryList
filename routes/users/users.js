const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// USER MODEL
const User = require('../../models/user');

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
        email: req.body.email,
        username: req.body.username,
        password: hashedPassword
    });

    await user.save();
    res.send('User added successfully');
})

module.exports = router;
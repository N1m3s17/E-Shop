'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();

// Login Routes

router.post('/login', (req, res) => {
    res.send('Login');
});

router.post('/signup', (req, res) => {
    res.send('Signup');
});


// Main Routes

router.get('/', (req, res) => {
    res.send('GET');
});

router.post('/item', (req, res) => {
    res.send('POST');
});

router.put('/item/:id', (req, res) => {
    res.send('PUT');
});

router.delete('/item/:id', (req, res) {
    res.send('DESTROY');
});

module.exports = router;

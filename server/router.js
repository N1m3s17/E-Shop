'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();

// Login Routes

router.post('/login', (req, res) => {
    res.send('Login');
    res.status(200);
});

router.post('/signup', (req, res) => {
    res.send('Signup');
    res.status(200);
});


// Main Routes

router.get('/', (req, res) => {
    res.send('GET');
    res.status(200);
});

router.post('/shoe', (req, res) => {
    res.send('POST');
    res.status(200);
});

router.put('/shoe/:id', (req, res) => {
    res.send('PUT');
    res.status(200);
});

router.delete('/shoe/:id', (req, res) => {
    res.send('DESTROY');
    res.status(200);
});

module.exports = router;

'use strict';

const express = require('express');
const router = require('./router');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

//Routes
app.use(router);

app.listen(3000, () => {
    console.log('Server is Running!');

});
'use strict';

const express = require('express');
const router = require('./router');

const app = express();

//Routes
app.use(router);

app.listen(3000, () => {
    console.log('Server is Running!');

});
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const router = express.Router();

// Login Routes

router.post('/login', (req, res) => {
    res.send('Login');
    res.status(200);
});


router.get('/signup', (req, res) => {
    res.render('signup', {
        pageId: 'signup',
        title: 'Signup',
        name: null,    
});
});

router.post('/signup', (req, res) => {
    res.send('Signup');
    res.status(200);
});


// Main Routes


// This route is the homepage route which shows all shoes

router.get('/', (req, res, next) => {
    db.getAllItems()
    .then((shoes) => {
        res.render('home', {
            pageId: 'home',
            title: 'Home',
            shoes: shoes,
        });   
    });
});

// This route show a shoe by it's id

router.get('/shoe/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    db.getAllItems()
    .then((shoes) => {
        shoes.forEach((shoe) => {
            if(shoe.id === id){
                res.render('shoebyid', {
                    pageId: 'home',
                    title: 'Home',
                    shoe: shoe,
                });
            };
        });
    });

});

//Below routes allow the user to add a shoe

router.get('/addshoe', (req, res) => {
    res.render('addshoe', {
        pageId: 'addshoe',
        title: 'Add a Shoe',
        brand: null,
        name: null,
    });
});

router.post('/addshoe', (req, res, next) => {
    let brand = req.body.brand.trim();
    let name = req.body.name.trim();

    if (!name) {
      res
        .status(400)
        .render('addshoe', {
          pageId: 'addshoe',
          title: 'Add a Shoe',
          brand: brand,
          name: name,
        });
    } else {
      db.createItem({
        brand: brand,
        name: name,
      })
        .then(() => {
          res.redirect(301, '/');
        })
        .catch(next);
    }
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

'use strict';

const express = require('express');
const bodyParser = require('body-parser');
let argon = require('argon2');
const db = require('./db');

const router = express.Router();

// Login Routes

router.get('/login', (req, res) => {
    res.render('login', {
        pageId: 'login',
        title: 'Login',
        username: null,
        formValues: { username: null, password: null },
        formErrors: { username: null, password: null },
    });
});

router.post('/login', (req, res, next) => {
    db.usernameExists(req.body.username)
    .then((usernameExists) => {
      // Login is not valid if username does not exist
      if (!usernameExists) {
        return false;
      // If the username exists verify the password is correct
      } else {
        return db.getUserPasswordHash(req.body.username)
          .then((dbHash) => {
            return argon.verify(dbHash, req.body.password);
          });
      }
    })
    .then((isValid) => {
      // If invalid respond with authentication failure
      if (!isValid) {
        res
          .status(401)
          .render('login', {
            pageId: 'login',
            title: 'Login',
            username: req.body.username,
            formError: 'Authentication failed.',
            formValues: {
              username: req.body.username || null,
              password: req.body.password || null,
            },
            formErrors: { username: null, password: null },
          });
      // Else log the user in and redirect to home page
      } else {
        req.session.username = req.body.username
        res.redirect('/');
      }
    })
    .catch(next);
});

router.get('/logout', (req, res, next) => {
    req.session.destroy((error) => {
      if (error) {
        next(error);
       } else {
        req.session.username = req.body.username
        res.redirect('/');
      }
});
});



router.get('/register', (req, res) => {
    res.render('register', {
        pageId: 'register',
        title: 'Register',
        username: null, 
        formValues: { username: null, password: null },
        formErrors: { username: null, password: null },
});
});


router.post('/register', (req, res, next) => {
    // First we check if the username provided already exists
  db.usernameExists(req.body.username)
  .then((usernameExists) => {
    // Check if form values are valid
    console.log(req.body, usernameExists);
    let formErrors = {
      username: (!usernameExists && req.body.username) ? null : 'Invalid username',
      password: (req.body.password && req.body.password.length >= 6) ? null : 'Invalid password',
    };

    // If there are any errors do not register the user
    if (formErrors.username || formErrors.password) {
      res
        .status(400)
        .render('register', {
          pageId: 'register',
          title: 'Register',
          username: null,
          formErrors: formErrors,
          formValues: {
            username: req.body.username,
            password: req.body.password,
          },
        });
    // Else if the form values are valid
    } else {
      return argon.hash(req.body.password)
        .then((dbHash) => {
          let newUser = {
            username: req.body.username,
            password: dbHash,
          };

          return db.addUser(newUser);
        })
        .then(() => {
          req.session.username = req.body.username
          res.redirect('/success');
        });
    }
  })
  .catch(next);
})

router.get('/success', (req, res,) => {
  res.render('success', {
    pageId: 'success',
    title: 'Home',
    username: req.session.username,
  })
})

// Main Routesnpm

// This route is the homepage route which shows all shoes

router.get('/', (req, res, next) => {
    db.getAllItems()
    .then((shoes) => {
        res.render('home', {
            pageId: 'home',
            title: 'Home',
            shoes: shoes,
            username: req.body.username,
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
                    pageId: 'shoebyid',
                    title: 'Find Shoe',
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
        id: null,
        brand: null,
        name: null,
        url: null,
        description: null,
    });
});

router.post('/addshoe', (req, res, next) => {
    let id = parseInt(req.body.id, 10);
    let brand = req.body.brand.trim();
    let name = req.body.name.trim();
    let url = req.body.url.trim();
    let description = req.body.description.trim();

    if (!name) {
      res
        .status(400)
        .render('addshoe', {
          pageId: 'addshoe',
          title: 'Add a Shoe',
          id: id,
          brand: brand,
          name: name,
          url: url,
          description: description,
        });
    } else {
      db.createItem({
        id: id,
        brand: brand,
        name: name,
        url: url,
        description: description,
      })
        .then(() => {
          res.redirect(301, '/');
        })
        .catch(next);
    }
  });

  
  router.get('/shoe/:id/edit', (req, res) => {
    const id = parseInt(req.params.id, 10);
    db.getAllItems()
    .then((shoes) => {
        shoes.forEach((shoe) => {
            if(shoe.id === id){
                res.render('updateshoe', {
                    pageId: 'updateshoe',
                    title: 'Edit Shoe',
                    shoe: shoe,
                });
            };
        });
    });

});

  router.post('/shoe/:id/edit', (req, res, next) => {
    const id = parseInt(req.params.id, 10);
    db.updateItemByName(id, req.body)
      .then((shoes) => {
        shoes.forEach((shoe) => {
          if(shoe.id === id){
              res.render('shoebyid', {
                  pageId: 'shoebyid',
                  title: 'Find Shoe',
                  shoe: shoe,
              });
          };
      });
      })
      .catch((error) => {
        return next(error);
      });
  });
  
  

router.get('/removeshoe/:id', (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  db.deleteItemById(id)
    .then((shoes) => {
      res.render('home', {
        pageId: 'home',
        title: 'Home',
        shoes: shoes,
      });
    })
    .catch((error) => {
      return next(error);
    });
});

module.exports = router;

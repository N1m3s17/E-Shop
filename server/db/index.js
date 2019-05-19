let util = require('util');
let path = require('path');
let fs = require('fs');

let readFile = util.promisify(fs.readFile);
let writeFile = util.promisify(fs.writeFile);


let itemsPath = path.resolve('server/db/items.json');
let usersPath = path.resolve('server/db/login_info.json');

// READ AND WRITE TO ITEMS JSON

async function readItems() {
    return readFile(itemsPath)
      .then((contents) => {
        return JSON.parse(contents);
      });
  }

async function writeItems(items) {
    let json = JSON.stringify(items, null, 2);
    return writeFile(itemsPath, json)
      .then(() => items);
    }

async function createItem(item) {
  return readItems()
    .then((items) => {
      // Ensures name is unique
      items.forEach((a) => {
        if (a.name === item.name && a.id === item.id) {
          // function won't excute including not executing items.push(item);
          throw new Error('Shoe already exists.');
        } 
      });
      items.push(item);
      return writeItems(items);
    });
}

async function updateItemByName(id, updatedItem) {
  return readItems()
    .then((allItems) => {
      return allItems.map((item) => {
        if (item.id === id) {
          return updatedItem;
        } else {
          return item;
        }
      });
    })
    .then((items) => {
      return writeItems(items);
    });
}

async function deleteItemById(id) {
  return readItems()
    .then((allItems) => {
      return allItems.filter((item) => {
        return item.id !== id;
      });
    })
    .then((items) => {
      return writeItems(items);
    });
}

  
 
    
// READ AND WRITE TO USERS JSON

  async function readUsers() {
    return readFile(usersPath)
      .then((contents) => {
        return JSON.parse(contents);
      });
  }

  function writeUsers(users) {
    return writeFile(usersPath, JSON.stringify(users, null, 2));
  }
  
  
  
  function usernameExists(username) {
    return readUsers()
      .then((users) => {
        let exists = false;
  
        users.forEach((user) => {
          if (user.username === username) {
            exists = true;
          }
        });
  
        return exists;
      });
  }

  function addUser(user) {
    return readUsers()
      .then((users) => {
        return writeUsers(users.concat(user));
      });
  }  
  
  function getUserPasswordHash(username) {
    return readUsers()
      .then((users) => {
        let match;
  
        users.forEach((user) => {
          if (user.username === username) {
            match = user;
          }
        });
  
        if (!match) {
          throw new Error('User does not exist.');
        }
  
        return match.password;
      });
  }
  
  module.exports = {
    getAllItems: readItems,
    createItem: createItem,
    updateItemByName: updateItemByName,
    deleteItemById: deleteItemById,
    addUser: addUser,
    usernameExists: usernameExists,
    getUserPasswordHash: getUserPasswordHash,
  };
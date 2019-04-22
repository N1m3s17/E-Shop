let util = require('util');
let path = require('path');
let fs = require('fs');

let readFile = util.promisify(fs.readFile);
let writeFile = util.promisify(fs.writeFile);


let itemsPath = path.resolve('server/db/items.json');
let personal_infoPath = path.resolve('server/db/login_info.json');

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
  let id = 0;
  return readItems()
    .then((items) => {
      // Ensures name is unique
      items.forEach((a) => {
        if (a.name === item.name) {
          // function won't excute including not executing countries.push(country);
          throw new Error('Shoe already exists.');
        }
      id += 1;
      
      });
      item.id = id;
      items.push(item);
      return writeItems(items);
    });
}

  
 
    
// READ AND WRITE TO PERSONAL INFO JSON

  async function readPersonal() {
    return readFile(personal_infoPath)
      .then((contents) => {
        return JSON.parse(contents);
      });
  }

  async function writePersonal(info) {
    let json = JSON.stringify(info, null, 2);
    return writeFile(itemsPath, json);
  }
  
   
  module.exports = {
    getAllItems: readItems,
    createItem: createItem,
  };
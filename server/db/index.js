let util = require('util');
let path = require('path');
let fs = require('fs');

let readFile = util.promisify(fs.readFile);
let writeFile = util.promisify(fs.writeFile);


let itemsPath = path.resolve('server/db/items.json');
let personal_infoPath = path.resolve('server/db/personal_info.json');

// READ AND WRITE TO ITEMS JSON

async function readItems() {
    return readFile(itemsPath)
      .then((contents) => {
        return JSON.parse(contents);
      });
  }

async function writeCountries(countries) {
    let json = JSON.stringify(countries, null, 2);
    return writeFile(itemsPath, json);
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
  
   
  
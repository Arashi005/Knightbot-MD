const fs = require("fs");

function loadDB() {
  return JSON.parse(fs.readFileSync("./database.json"));
}

function saveDB(db) {
  fs.writeFileSync("./database.json", JSON.stringify(db, null, 2));
}

function getUser(db, id) {
  if (!db[id]) {
    db[id] = {
      money: 1000,
      lastDaily: 0
    };
  }
  return db[id];
}

module.exports = { loadDB, saveDB, getUser };
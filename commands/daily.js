const fs = require("fs");

module.exports = {
  name: "daily",
  execute: async (sock, msg) => {

    let db = JSON.parse(fs.readFileSync("./database.json"));
    let user = msg.key.participant || msg.key.remoteJid;

    if (!db[user]) db[user] = { money: 0 };

    db[user].money += 500;

    await sock.sendMessage(msg.key.remoteJid, {
      text: "⚡ +500 coins added. Don’t waste it."
    });

    fs.writeFileSync("./database.json", JSON.stringify(db, null, 2));
  }
};
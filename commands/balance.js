const fs = require("fs");

module.exports = {
  name: "balance",
  execute: async (sock, msg) => {

    let db = JSON.parse(fs.readFileSync("./database.json"));
    let user = msg.key.participant || msg.key.remoteJid;

    if (!db[user]) db[user] = { money: 1000 };

    await sock.sendMessage(msg.key.remoteJid, {
      text: `💰 Balance: ${db[user].money} coins`
    });

    fs.writeFileSync("./database.json", JSON.stringify(db, null, 2));
  }
};
const fs = require("fs");

module.exports = {
  name: "work",
  execute: async (sock, msg) => {

    let db = JSON.parse(fs.readFileSync("./database.json"));
    let user = msg.key.participant || msg.key.remoteJid;

    if (!db[user]) db[user] = { money: 0 };

    const earned = Math.floor(Math.random() * 300) + 100;
    db[user].money += earned;

    await sock.sendMessage(msg.key.remoteJid, {
      text: `⚡ Work complete.\nEarned: ${earned} coins`
    });

    fs.writeFileSync("./database.json", JSON.stringify(db, null, 2));
  }
};
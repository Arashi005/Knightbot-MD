const { loadDB, saveDB, getUser } = require("../economy");

module.exports = {
  name: "work",
  execute: async (sock, msg) => {

    const id = msg.key.remoteJid;

    let db = loadDB();
    let user = getUser(db, id);

    const earnings = Math.floor(Math.random() * 300) + 100;

    user.money += earnings;

    saveDB(db);

    await sock.sendMessage(id, {
      text: `⚡ You worked under Voltaria’s system.\nEarned: ${earnings} coins`
    });
  }
};
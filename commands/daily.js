const { loadDB, saveDB, getUser } = require("../economy");

module.exports = {
  name: "daily",
  execute: async (sock, msg) => {

    const id = msg.key.remoteJid;

    let db = loadDB();
    let user = getUser(db, id);

    const now = Date.now();
    const cooldown = 24 * 60 * 60 * 1000; // 24h

    if (now - user.lastDaily < cooldown) {
      const remaining = cooldown - (now - user.lastDaily);
      const hours = Math.ceil(remaining / (1000 * 60 * 60));

      return sock.sendMessage(id, {
        text: `⚡ Daily already claimed.\nCome back in ${hours}h.`
      });
    }

    const reward = 500;
    user.money += reward;
    user.lastDaily = now;

    saveDB(db);

    await sock.sendMessage(id, {
      text: `⚡ Daily reward claimed!\n+${reward} coins`
    });
  }
};
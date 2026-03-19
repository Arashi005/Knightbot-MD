const { loadDB, saveDB, getUser } = require("../economy");

module.exports = {
  name: "balance",
  execute: async (sock, msg) => {

    const id = msg.key.remoteJid;

    let db = loadDB();
    let user = getUser(db, id);

    saveDB(db);

    await sock.sendMessage(id, {
      text: `💰 Voltaria Wallet\n\nCoins: ${user.money}`
    });
  }
};
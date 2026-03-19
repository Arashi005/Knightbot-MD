module.exports = {
  name: "alive",
  execute: async (sock, msg) => {

    await sock.sendMessage(msg.key.remoteJid, {
      text: "⚡ Voltaria-MD is online.\nSystem stable."
    });

  }
};
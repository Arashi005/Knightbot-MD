module.exports = {
  name: "ping",
  execute: async (sock, msg) => {

    const start = Date.now();
    const end = Date.now();

    await sock.sendMessage(msg.key.remoteJid, {
      text: `⚡ Speed: ${end - start}ms`
    });

  }
};
module.exports = {
  name: "ping",
  execute: async (sock, msg) => {
  const args = msg.body?.split(" ").slice(1).join(" ");

    const start = Date.now();
    const end = Date.now();

    await sock.sendMessage(msg.key.remoteJid, {
      text: `⚡ Speed: ${end - start}ms`
    });

  }
};
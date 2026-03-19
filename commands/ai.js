module.exports = {
  name: "ai",
  execute: async (sock, msg, args) => {

    if (!args.length) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "Speak clearly. I don’t decode silence."
      });
    }

    const replies = [
      "That was weak.",
      "Try again. Properly this time.",
      "I expected intelligence.",
      "No. Just no.",
      "Even a calculator would do better."
    ];

    const res = replies[Math.floor(Math.random() * replies.length)];

    await sock.sendMessage(msg.key.remoteJid, {
      text: `⚡ Voltaria:\n${res}`
    });
  }
};
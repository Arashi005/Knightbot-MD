module.exports = {
  name: "insult",
  execute: async (sock, msg) => {

    const insults = [
      "You're not even worth a full sentence.",
      "I’ve seen better logic in broken apps.",
      "You tried… unfortunately.",
      "Your brain is on airplane mode.",
      "Silence suits you better."
    ];

    const res = insults[Math.floor(Math.random() * insults.length)];

    await sock.sendMessage(msg.key.remoteJid, {
      text: `⚡ ${res}`
    });
  }
};
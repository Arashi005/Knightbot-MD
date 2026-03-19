module.exports = {
  name: "ai",
  execute: async (sock, msg) => {

    const text =
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text || "";

    const args = text.split(" ").slice(1).join(" ");

    if (!args) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "⚡ Speak something. Don’t waste my time with silence."
      });
    }

    const replies = [
      "Hmm… that’s all you’ve got?",
      "I’ve seen better logic in broken code.",
      "Try again. This one is weak.",
      "Interesting… but still meaningless.",
      "You talk a lot for someone saying nothing."
    ];

    const response = replies[Math.floor(Math.random() * replies.length)];

    await sock.sendMessage(msg.key.remoteJid, {
      text: `⚡ VOLTARIA AI:\n\n${response}`
    });
  }
};
module.exports = {
  name: "menu",
  execute: async (sock, msg) => {

    const text = `
╭─⚡ V O L T A R I A ⚡─╮
│ "I don’t take orders. I process requests."
│
├─ SYSTEM
│ .menu .ping .alive
│
├─ AI CORE
│ .ai <text>
│ .insult
│
├─ ECONOMY
│ .balance .daily .work
│
├─ MEDIA
│ .play .weather .tts
│
├─ MODERATION
│ .warn .unmute .unban
│
╰────────────────────╯

⚡ Voltaria-MD online
`;

    await sock.sendMessage(msg.key.remoteJid, { text });
  }
};
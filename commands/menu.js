module.exports = {
  name: "menu",
  execute: async (sock, msg) => {

    const menu = `
╭─⚡ V O L T A R I A ⚡─╮
│
│ "I respond… I don’t obey."
│
├── ⚙️ SYSTEM
│ .menu
│ .ping
│ .alive
│
├── 🤖 AI
│ .ai
│
├── 😈 FUN
│ .insult
│
├── 💰 ECONOMY
│ .balance
│ .daily
│ .work
│
├── 🛡️ MODERATION
│ .warn
│ .unban
│ .unmute
│
╰────────────────────╯

⚡ Status: ONLINE
⚡ Mode: Cold Active
⚡ Voltaria-MD v2.0.0
`;

    await sock.sendMessage(msg.key.remoteJid, {
      text: menu
    });

  }
};
/**
 * Voltaria Bot - WhatsApp AI System
 * Rebranded from Knight Bot
 * Version: 2.0.0
 */

require('./settings')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const chalk = require('chalk')
const FileType = require('file-type')
const path = require('path')
const axios = require('axios')
const { handleMessages, handleGroupParticipantUpdate, handleStatus } = require('./main')
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetch, sleep, reSize } = require('./lib/myfunc')

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  generateWAMessageFromContent,
  jidDecode,
  proto,
  jidNormalizedUser,
  makeCacheableSignalKeyStore,
  delay
} = require("@whiskeysockets/baileys")

const NodeCache = require("node-cache")
const pino = require("pino")
const readline = require("readline")
const { parsePhoneNumber } = require("libphonenumber-js")
const { rmSync } = require('fs')

const store = require('./lib/lightweight_store')
store.readFromFile()

const settings = require('./settings')
setInterval(() => store.writeToFile(), settings.storeWriteInterval || 10000)

// ⚡ VOLTARIA CORE IDENTITY
global.botname = "VOLTARIA"
global.themeemoji = "⚡"
global.version = "2.0.0"

// memory cleanup
setInterval(() => {
  if (global.gc) global.gc()
}, 60000)

let phoneNumber = "911234567890"
let owner = JSON.parse(fs.readFileSync('./data/owner.json'))

const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")

const rl = process.stdin.isTTY ? readline.createInterface({
  input: process.stdin,
  output: process.stdout
}) : null

const question = (text) => {
  if (rl) return new Promise(res => rl.question(text, res))
  return Promise.resolve(settings.ownerNumber || phoneNumber)
}

async function startVoltaria() {
  try {
    let { version } = await fetchLatestBaileysVersion()
    const { state, saveCreds } = await useMultiFileAuthState(`./session`)
    const msgRetryCounterCache = new NodeCache()

    const Voltaria = makeWASocket({
      version,
      logger: pino({ level: 'silent' }),
      printQRInTerminal: !pairingCode,
      browser: ["Voltaria", "Chrome", "2.0.0"],
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }))
      },
      markOnlineOnConnect: true,
      getMessage: async (key) => {
        let jid = jidNormalizedUser(key.remoteJid)
        let msg = await store.loadMessage(jid, key.id)
        return msg?.message || ""
      },
      msgRetryCounterCache,
      defaultQueryTimeoutMs: 60000
    })

    Voltaria.ev.on('creds.update', saveCreds)
    store.bind(Voltaria.ev)

    // 💬 MESSAGE HANDLER
    Voltaria.ev.on('messages.upsert', async chatUpdate => {
      try {
        const mek = chatUpdate.messages[0]
        if (!mek.message) return

        mek.message = Object.keys(mek.message)[0] === 'ephemeralMessage'
          ? mek.message.ephemeralMessage.message
          : mek.message

        if (mek.key.remoteJid === 'status@broadcast') {
          await handleStatus(Voltaria, chatUpdate)
          return
        }

        if (mek.key.id.startsWith('BAE5')) return

        if (Voltaria.public !== false && !mek.key.fromMe) {
          await handleMessages(Voltaria, chatUpdate, true)
        }

      } catch (e) {
        console.log(e)
      }
    })

    Voltaria.decodeJid = (jid) => {
      if (!jid) return jid
      if (jid.includes(':')) {
        return jidDecode(jid)?.user + '@' + jidDecode(jid)?.server || jid
      }
      return jid
    }

    Voltaria.public = true

    Voltaria.serializeM = (m) => smsg(Voltaria, m, store)

    // ⚡ CONNECTION EVENTS
    Voltaria.ev.on('connection.update', async (s) => {
      const { connection, lastDisconnect } = s

      if (connection === 'open') {
        console.log(chalk.cyan(`\n⚡ [ VOLTARIA v${global.version} ONLINE ]\n`))

        const botNumber = Voltaria.user.id.split(':')[0] + '@s.whatsapp.net'

        await Voltaria.sendMessage(botNumber, {
          text: `⚡ VOLTARIA ONLINE\n\n⏰ ${new Date().toLocaleString()}\n\n💬 "I don’t sleep. I calculate."`
        })

        console.log(chalk.green(`${global.themeemoji} SYSTEM READY`))
        console.log(chalk.magenta(`${global.themeemoji} MODE: COLD AI ACTIVE`))
        console.log(chalk.red(`${global.themeemoji} VOLTARIA CORE STABLE`))
      }

      if (connection === 'close') {
        const shouldReconnect =
          lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut

        console.log(chalk.red("Connection closed. Reconnecting:", shouldReconnect))

        if (shouldReconnect) startVoltaria()
      }
    })

    // 👥 GROUP HANDLER
    Voltaria.ev.on('group-participants.update', async (update) => {
      await handleGroupParticipantUpdate(Voltaria, update)
    })

    return Voltaria

  } catch (e) {
    console.log("Error:", e)
    setTimeout(startVoltaria, 5000)
  }
}

startVoltaria()

process.on('uncaughtException', console.error)
process.on('unhandledRejection', console.error)
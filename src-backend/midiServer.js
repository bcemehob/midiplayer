const express = require("express")
const multer = require("multer")
const { Player } = require("midi-player-js")

let clients = []
const upload = multer({ dest: "uploads/" })
let currentPlayer = null


function createMidiServer() {
  const app = express()
  app.use(express.static("public"))
  app.post("/upload", storeFile, returnFileName)
  app.get("/start", startBroadcastPlayback)
  app.get("/stop", stopPlayback)
  app.get("/events", registerUiClient)
  return app
}

const startBroadcastPlayback = (req, res) => {
  const file = "uploads/" + req.query.file
  currentPlayer = new Player(eventEmitter)
  currentPlayer.loadFile(file)
  currentPlayer.play()
  res.send("Playback started")
}

const eventEmitter = event => {
  clients.forEach(client => client.write(`data: ${JSON.stringify(event)}\n\n`))
}

const registerUiClient = (req, res) => {
  res.setHeader("Content-Type", "text/event-stream")
  res.setHeader("Cache-Control", "no-cache")
  res.setHeader("Connection", "keep-alive")
  res.flushHeaders()
  clients.push(res)
  req.on("close", () => {
    clients = clients.filter(client => client !== res)
  })
}

const storeFile = upload.single("midi")
const returnFileName = (req, res) => res.json({ file: req.file.filename })
const stopPlayback = (_, res) => {
  if (currentPlayer) currentPlayer.stop()
  res.send("Playback stopped")
}

module.exports = { createMidiServer }
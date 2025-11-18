const express = require("express")
const { Player } = require("midi-player-js")
const { download, handleArchive, storeArchive, folderPath } = require("./FileHelper")
const Properties = require("./Properties")
const { registerUiClient, emitEvent } = require("./SSEHelper")

let currentPlayer = null

function createMidiServer() {
  const app = express()
  app.use(express.static("public"))
  app.use("/files", express.static(folderPath))
  app.post("/api/upload", storeArchive, handleArchive)
  app.get("/api/download/:folder/:file", download)
  app.get("/api/events", registerUiClient)
  app.get("/api/start", startBroadcastPlayback)
  app.get("/api/stop", stopPlayback)
  return app
}

const startBroadcastPlayback = (req, res) => {
  const file = `${Properties.storedFoldersName}/${req.query.folder}/${req.query.file}`
  currentPlayer = new Player(emitEvent)
  currentPlayer.loadFile(file)
  currentPlayer.play()
  res.send("Playback started")
}


const stopPlayback = (_, res) => {
  if (currentPlayer) currentPlayer.stop()
    res.send("Playback stopped")
}

module.exports = { createMidiServer }
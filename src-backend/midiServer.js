const express = require("express")
const { download, handleArchive, storeArchive, folderPath, getMidiFile } = require("./FileHelper")
const { registerUiClient, emitEvent } = require("./SSEHelper")
const { play, stop, analyze } = require("./MidiHelper")

function createMidiServer() {
  const app = express()
  app.use(express.static("public"))
  app.use("/files", express.static(folderPath))
  app.post("/api/upload", storeArchive, handleArchive)
  app.get("/api/download/:folder/:file", download)
  app.get("/api/events", registerUiClient)
  app.get("/api/start", (req, res) => play(req, res, emitEvent))
  app.get("/api/stop", stop)
  app.get("/api/analyze", analyzeMidi)
  return app
}

async function analyzeMidi(req, res) {
  const file = await getMidiFile(req.query.folder, req.query.file)
  res.json(analyze(file))
}

module.exports = { createMidiServer }
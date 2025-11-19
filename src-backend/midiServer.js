const express = require("express")
const { 
  download, 
  handleArchive, 
  storeArchive, 
  folderPath,
  pathToStatic, 
  getMidiFile, 
  latestBundle 
} = require("./FileHelper")
const { registerUiClient, emitEvent } = require("./SSEHelper")
const { play, stop, analyze } = require("./MidiHelper")

function createMidiServer() {
  const app = express()
  app.use(express.static(pathToStatic))
  app.use("/files", express.static(folderPath))
  app.post("/api/upload", storeArchive, handleArchive)
  app.get("/api/download/:folder/:file", download)
  app.get("/api/analyze/:folder/:file", analyzeMidi)
  app.get("/api/start/:folder/:file", (req, res) => play(req, res, emitEvent))
  app.get("/api/latest", latestBundle)
  app.get("/api/events", registerUiClient)
  app.get("/api/stop", stop)
  return app
}

async function analyzeMidi(req, res) {
  const file = await getMidiFile(req)
  res.json(analyze(file))
}

module.exports = { createMidiServer }
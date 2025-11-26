const express = require("express")
const { 
  download, 
  handleArchive, 
  storeArchive, 
  getMidiFile, 
  latestBundle, 
  projects,
  project,
  deleteProject
} = require("./FileHelper")
const paths = require("./paths")

const { registerUiClient, emitEvent } = require("./SSEHelper")
const { play, stop, pause, analyze } = require("./MidiHelper")

function createServer() {
  const app = express()
  app.use(express.static(paths.pathToStatic))
  app.use("/files", express.static(paths.folderPath))
  app.post("/api/upload", storeArchive, handleArchive)
  app.get("/api/download/:folder/:file", download)
  app.get("/api/analyze/:folder/:file", analyzeMidi)
  app.get("/api/start/:folder/:file", (req, res) => play(req, res, emitEvent))
  app.get("/api/latest", latestBundle)
  app.get("/api/projects", projects)
  app.get("/api/project/:folder", project)
  app.delete("/api/project/:folder", deleteProject)
  app.get("/api/events", registerUiClient)
  app.get("/api/stop", stop)
  app.get("/api/pause", pause)
  return app
}

async function analyzeMidi(req, res) {
  const file = await getMidiFile(req)
  res.json(analyze(file))
}

module.exports = { createServer }
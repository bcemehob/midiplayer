const express = require("express")
const { 
  download, 
  handleArchive, 
  storeArchive, 
  getFile, 
  latestBundle,
  projects,
  project,
  deleteProject
} = require("./FileHelper")
const paths = require("./paths")

const { registerUiClient, emitEvent } = require("./SSEHelper")
const { play, stop, pause, analyze, jump, resetPlayer } = require("./MidiHelper")
const events = require('./events')

events.on('projectChanged', async () => resetPlayer(paths.fullMidiPath(), emitEvent, await getFile(paths.fullMidiPath())))

function createServer() {
  const app = express()
  app.use(express.static(paths.pathToStatic))
  app.use("/files", express.static(paths.folderPath))
  app.post("/api/upload", storeArchive, handleArchive)
  app.get("/api/download/:folder/:file", download)
  app.get("/api/analyze", analyze)
  app.get("/api/start", play)
  app.get("/api/latest", latestBundle)
  app.get("/api/projects", projects)
  app.get("/api/project/:folder", project)
  app.delete("/api/project/:folder", deleteProject)
  app.get("/api/events", registerUiClient)
  app.get("/api/stop", stop)
  app.get("/api/pause", pause)
  app.get("/api/jump", jump)
  return app
}

module.exports = { createServer }
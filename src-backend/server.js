const express = require("express")
const { 
  downloadAudio, 
  handleArchive,
  compressCurrentProject,
  storeArchive, 
  getFile, 
  latestBundle,
  projects,
  project,
  deleteProject
} = require("./helpers/file/file")
const paths = require("./paths")
const {track} = require("./helpers/track")


const { registerUiClient, emitEvent } = require("./helpers/sse")
const { play, stop, pause, analyze, jump, resetPlayer } = require("./helpers/midi")
const events = require('./events')

events.on('projectChanged', async () => resetPlayer(paths.fullMidiPath(), emitEvent, await getFile(paths.fullMidiPath())))

function createServer() {
  const app = express()
  app.use(express.static(paths.pathToStatic))
  app.use("/files", express.static(paths.folderPath()))
  app.post("/api/upload", storeArchive, handleArchive)
  app.post("/api/compress", compressCurrentProject)
  app.get("/api/audio", downloadAudio)
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
  app.get("/api/track/:index", track)
  return app
}

module.exports = { createServer }
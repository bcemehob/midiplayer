const express = require("express")
const { 
  downloadAudio, 
  compressCurrentProject,
  storeArchive,
  createTrackInfoFiles,
  latestBundle,
  projects,
  bundle,
  deleteProject
} = require("./helpers/file/file")
const { unzipArchive } = require("./helpers/file/unzip")
const paths = require("./paths")
const {
  track, 
  addPartyElement,
  deletePartyElement,
  deleteParty
} = require("./helpers/track/track")


const { registerUiClient, emitEvent } = require("./helpers/sse")
const { play, stop, pause, jump, resetPlayer } = require("./helpers/midi/player")
const { analyze, midiTracks } = require("./helpers/midi/analyzer")
const events = require('./events')

events.on('projectChanged', async () => resetPlayer(emitEvent))

function createServer() {
  const app = express()
  app.use(express.static(paths.pathToStatic))
  app.use("/files", express.static(paths.folderPath()))
  app.use(express.json())
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
  app.patch("/api/track/:index", addPartyElement)
  app.delete("/api/track/:index/element/:elementId", deletePartyElement)
  app.delete("/api/track/:index/party/:partyId", deleteParty)
  return app
}

async function handleArchive(req, res) {
  paths.timestamp = Date.now().toString()
  try {
    await unzipArchive(req.file.path)
    resetPlayer(emitEvent)
    createTrackInfoFiles(midiTracks())
    res.json(paths.successResponse(true))
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Server error" })
  }
}

function project(req, res) {
  bundle(req.params.folder)
  res.json(paths.successResponse())
}


module.exports = { createServer }
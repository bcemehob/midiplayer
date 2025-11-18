const Properties = require("./Properties")
const { Player } = require("midi-player-js")

let currentPlayer = null

function play (req, res, emitEvent) {
  const file = `${Properties.storedFoldersName}/${req.query.folder}/${req.query.file}`
  currentPlayer = new Player(emitEvent)
  currentPlayer.loadFile(file)
  currentPlayer.play()
  res.send("Playback started")
}

function stop(_, res) {
  if (currentPlayer) currentPlayer.stop()
    res.send("Playback stopped")
}

module.exports = { play, stop }
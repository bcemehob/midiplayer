const Properties = require("./Properties")
const { Player } = require("midi-player-js")
const { Midi } = require("@tonejs/midi")
let currentPlayer = null

function play (req, res, emitEvent) {
  const { folder, file } = req.params
  const filePath = `${Properties.storedFoldersName}/${folder}/${file}`
  currentPlayer = new Player(emitEvent)
  currentPlayer.loadFile(filePath)
  currentPlayer.play()
  res.send("Playback started")
}

function stop(_, res) {
  if (currentPlayer) currentPlayer.stop()
    res.send("Playback stopped")
}

function analyze(file) {
    const midi = new Midi(file)
    return {
        tempos: midi.header.tempos,
        timeSignatures: midi.header.timeSignatures,
        totalTicks: midi.durationTicks,
        ppqn: midi.header.ppq,
        lastTickTime: lastTickTime(midi)
    }
}

const lastTickTime = midi => {
    if (!midi?.durationTicks) return 0
    return Math.trunc(midi.header.ticksToSeconds(midi.durationTicks) * 1000)
}

module.exports = { play, stop, analyze }
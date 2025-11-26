const Properties = require("./Properties")
const { Player } = require("midi-player-js")
const { Midi } = require("@tonejs/midi")
const paths = require("./paths")
let currentPlayer = null
let filePath = null

function play(res, emitEvent) {
  const newPath = paths.fullMidiPath()
  if (newPath !== filePath) {
    filePath = newPath
    currentPlayer = new Player(emitEvent)
    currentPlayer.loadFile(filePath)
  }
  currentPlayer.play()
  res.send("Playback started")
}

function stop(_, res) {
  if (currentPlayer) currentPlayer.stop()
  res.send("Playback stopped")
}

function pause(_, res) {
  if (currentPlayer) currentPlayer.pause()
  res.send("Playback paused")
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

module.exports = { play, stop, pause, analyze }
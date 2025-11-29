const Properties = require("./Properties")
const { Player } = require("midi-player-js")
const { Midi } = require("@tonejs/midi")
const events = require('./events')

let currentPlayer = null


function resetPlayer(filePath, emitEventFn) {
  currentPlayer = new Player(emitEventFn)
  currentPlayer.loadFile(filePath)
}

function play(_, res) {
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

function jump(req, res) {
  if (!currentPlayer) return
  currentPlayer.pause()
  currentPlayer.skipToTick(req.query.tick)
  res.send(`Rewind to tick ${currentPlayer.getCurrentTick()}`)
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

module.exports = { play, stop, pause, analyze, jump, resetPlayer }
const Properties = require("./Properties")
const { Player } = require("midi-player-js")
const { Midi } = require("@tonejs/midi")
const events = require('./events')

let currentPlayer = null
let midiAnalyzis = null


function resetPlayer(filePath, emitEventFn, midiFile) {
  currentPlayer = new Player(emitEventFn)
  currentPlayer.loadFile(filePath)
  midiAnalyzis = new Midi(midiFile)
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
  const tick = Number(req.query.tick)
  if (!currentPlayer) return
  currentPlayer.stop()
  currentPlayer.skipToTick(tick)
  res.json({
    tick: currentPlayer.getCurrentTick(),
    songTime: currentPlayer.getSongTime(),
    remainingTime: currentPlayer.getSongTimeRemaining(),
    time: currentPlayer.getSongTime() - currentPlayer.getSongTimeRemaining()
  })
}

function analyze(_, res) {
  res.json({
    tempos: midiAnalyzis.header.tempos,
    timeSignatures: midiAnalyzis.header.timeSignatures,
    totalTicks: midiAnalyzis.durationTicks,
    ppqn: midiAnalyzis.header.ppq,
    lastTickTime: lastTickTime(midiAnalyzis)
  })
}

const lastTickTime = midi => {
  if (!midi?.durationTicks) return 0
  return Math.trunc(midi.header.ticksToSeconds(midi.durationTicks) * 1000)
}

module.exports = { play, stop, pause, analyze, jump, resetPlayer }
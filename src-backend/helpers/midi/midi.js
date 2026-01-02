const properties = require("../../properties")
const { Player } = require("midi-player-js")
const { Midi } = require("@tonejs/midi")
const events = require('../../events')

let currentPlayer = null
let midiAnalyzis = null


function resetPlayer(filePath, emitEventFn, midiFile) {
  currentPlayer = new Player(emitEventFn)
  emitEventFn({tick: 0})
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
    currentTimeMs: ticksToMsFromStart(tick),
    tick: currentPlayer.getCurrentTick(),
    songTime: currentPlayer.getSongTime(),
    remainingTime: currentPlayer.getSongTimeRemaining(),
    time: currentPlayer.getSongTime() - currentPlayer.getSongTimeRemaining()
  })
}

function ticksToMsFromStart(ticks) {
  if (!midiAnalyzis) return 0
  const tempos = midiAnalyzis.header.tempos
  const ppqn = midiAnalyzis.header.ppq
  const totalTicks = midiAnalyzis.durationTicks
  let prevTempoBlocksDuration = 0
  let curBlock = null
  for (let i = 0; i < tempos.length; i++) {
    const start = tempos[i].ticks
    const end = i < tempos.length - 1 ? tempos[i + 1].ticks : totalTicks
    if (end > ticks) {
      curBlock = tempos[i]
      break
    }
    const blockTicks = end - start
    const blockMs = ticksToMs(blockTicks, tempos[i].bpm, ppqn)
    prevTempoBlocksDuration += blockMs
  }
  const curTempoBlockOffset = ticks - curBlock.ticks
  const timeFromBlockStartMs = ticksToMs(curTempoBlockOffset, curBlock.bpm, ppqn)
  return Math.floor(prevTempoBlocksDuration + timeFromBlockStartMs)
}

const ticksToMs = (ticks, bpm, ppqn) => ticks * (60000 / (bpm * ppqn))

function analyze(_, res) {
  res.json({
    tempos: midiAnalyzis.header.tempos,
    timeSignatures: midiAnalyzis.header.timeSignatures,
    totalTicks: midiAnalyzis.durationTicks,
    ppqn: midiAnalyzis.header.ppq,
    tracks: midiAnalyzis.tracks,
    lastTickTime: lastTickTime(midiAnalyzis)
  })
}

const lastTickTime = midi => {
  if (!midi?.durationTicks) return 0
  return Math.trunc(midi.header.ticksToSeconds(midi.durationTicks) * 1000)
}

module.exports = { play, stop, pause, analyze, jump, resetPlayer }
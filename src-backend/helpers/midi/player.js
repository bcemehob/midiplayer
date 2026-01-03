const properties = require("../../properties")
const { Player } = require("midi-player-js")
const { reset, ticksToMsFromStart } = require('./analyzer')
const paths = require("../../paths")

let currentPlayer = null

async function resetPlayer(emitEventFn) {
  currentPlayer = new Player(emitEventFn)
  emitEventFn({tick: 0})
  currentPlayer.loadFile(paths.fullMidiPath())
  await reset()
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


module.exports = { play, stop, pause, jump, resetPlayer }
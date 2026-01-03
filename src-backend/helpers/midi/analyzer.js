const { Midi } = require("@tonejs/midi")
const { getFile, createFileIfNotExists } = require("../file/file")
const paths = require("../../paths")

let midiAnalyzis = null

async function reset() {
  const midiFile = await getFile(paths.fullMidiPath())
  midiAnalyzis = new Midi(midiFile)
}

function midiTracks(){
    return midiAnalyzis.tracks
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

module.exports = { analyze, ticksToMsFromStart, reset, midiTracks }

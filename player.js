const fs = require('fs')
const path = require('path')
const MidiPlayer = require('midi-player-js')
const player = require('play-sound')()


const pathToAudio = path.join(
  __dirname,
  'assets/audio/sample_audio.mp3'
)

player.play(
  pathToAudio,
  {timeout: 0},
  (err) => {
    if (err) console.error('Error playing audio:', err);
  }
);

// Create a new player instance
const Player = new MidiPlayer.Player((event) => {
  // console.log(JSON.stringify(event, null, 2));
});

const pathToMidi = path.join(
  __dirname,
  'assets/audio/sample.mid'
)

const midiData = fs.readFileSync(pathToMidi);
const arrayBuffer = midiData.buffer.slice(
  midiData.byteOffset,
  midiData.byteOffset + midiData.byteLength
);
Player.loadArrayBuffer(arrayBuffer);
Player.on('midiEvent', e => console.log("TRIGGERED tick", e.tick))
Player.on('endOfFile', () => console.log("STOPPED. Length", new Date().getTime() - startTime))
const startTime = new Date().getTime();
console.log("STARTED AT: ", startTime)
Player.skipToTick(5000)
Player.play();
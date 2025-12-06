const path = require("path")
const Properties = require("./Properties")

const rootDir = path.resolve(__dirname, "..")

const paths = {
  midi: null,
  audio: null,
  extract: null,
  timestamp: null,
  rootDir: rootDir,
  pathToStatic: path.join(rootDir, "dist"),
  folderPath: path.join(process.cwd(), Properties.storedFoldersName),
  fullMidiPath() {
    return path.join(this.folderPath, String(this.timestamp), String(this.midi))
  },
  reset() {
    this.midi = null
    this.audio = null
    this.timestamp = null
  }
}

module.exports = paths

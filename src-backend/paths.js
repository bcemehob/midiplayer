const path = require("path")
const properties = require("./properties")

const rootDir = path.resolve(__dirname, "..")

const paths = {
  midi: null,
  audio: null,
  timestamp: null,
  pathToStatic: path.join(rootDir, "dist"),
  folderPath() {
    return path.join(process.cwd(), properties.storedFoldersName)
  },
  currentFolderPath() {
    return path.join(this.folderPath(), String(this.timestamp))
  },
  fullMidiPath() {
    return path.join(this.currentFolderPath(), String(this.midi))
  },
  fullAudioPath() {
    return path.join(this.currentFolderPath(), String(this.audio))
  },
  fullPath(fileName) {
    return path.join(this.currentFolderPath(), String(fileName))
  },
  archivePath() {
    return path.join(this.currentFolderPath(), `${this.timestamp}.mpr`)
  },
  successResponse(isNewArchive) {
    return {
      message: isNewArchive ? "Archive processed" : "Latest archive found",
      folder: this.timestamp,
      midiFile: this.midi,
      audioFile: this.audio
    }
  },
  reset() {
    this.midi = null
    this.audio = null
    this.timestamp = null
  }
}

module.exports = paths

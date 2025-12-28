const path = require("path")
const properties = require("./properties")

const rootDir = path.resolve(__dirname, "..")

const paths = {
  midi: null,
  audio: null,
  extract: null,
  timestamp: null,
  rootDir: rootDir,
  pathToStatic: path.join(rootDir, "dist"),
  folderPath: path.join(process.cwd(), properties.storedFoldersName),
  fullMidiPath() {
    return path.join(this.folderPath, String(this.timestamp), String(this.midi))
  },
  fullPath(fileName) {
    return path.join(this.folderPath, String(this.timestamp), String(fileName))
  },
  archivePath() {
    return path.join(process.cwd(), properties.storedArchivesName, `${this.timestamp}.mpr`)
  },
  setCurrentFolder(folderName){
    this.timestamp = folderName
    this.extract = path.join(properties.storedFoldersName, this.timestamp)
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

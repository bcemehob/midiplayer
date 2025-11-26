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
  folderPath: path.join(process.cwd(), Properties.storedFoldersName)
}
console.log("PATHS:", paths)

module.exports = paths

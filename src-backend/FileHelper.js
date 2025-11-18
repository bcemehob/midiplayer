const path = require("path")
const fs = require("fs")
const fsp = require("fs/promises")
const unzipper = require("unzipper")
const multer = require("multer")
const Properties = require("./Properties")

const upload = multer({ dest: `${Properties.uploads}/` })
const folderPath = path.join(process.cwd(), Properties.storedFoldersName)
const storeArchive = upload.single("archive")
const paths = {
  midi: null,
  audio: null,
  extract: null,
  timestamp: null
}

async function handleArchive(req, res) {
  try {
    const zipPath = req.file.path
    paths.timestamp = Date.now().toString()
    paths.extract = path.join(Properties.storedFoldersName, paths.timestamp)
    fs.mkdirSync(paths.extract, { recursive: true })
    fs.createReadStream(zipPath)
      .pipe(unzipper.Parse())
      .on("entry", storeFile)
      .on("error", err => handleFileProcessingError(err, res))
      .on("close", () => prepareSuccessResponse(res))
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Server error" })
  }
}

function prepareSuccessResponse(res) {
  res.json({
    message: "Archive processed",
    folder: paths.timestamp,
    midiFile: paths.midi,
    audioFile: paths.audio
  })
}

function handleFileProcessingError(err, res) {
  console.log(err)
  res.status(500).json({ error: "Failed to unzip file" })
}

function storeFile(entry) {
  const fileName = entry.path
  const type = entry.type
  if (fileName.startsWith("__MACOSX/") || fileName.endsWith(".DS_Store")) {
    entry.autodrain()
    return
  }

  if (type === "File" && fileName.match(/\.(mid|midi)$/i)) {
    paths.midi = path.basename(fileName)
    entry.pipe(fs.createWriteStream(path.join(paths.extract, paths.midi)))
  } else if (type === "File" && fileName.match(/\.(mp3|wav|ogg)$/i)) {
    paths.audio = path.basename(fileName)
    entry.pipe(fs.createWriteStream(path.join(paths.extract, paths.audio)))
  } else {
    entry.autodrain()
  }
}

async function getMidiFile(req) {
  const { folder, file } = req.params
  return await fsp.readFile(filePath(folder, file))
}

function download(req, res) {
  const { folder, file } = req.params
  res.download(filePath(folder, file), file, (err) => {
    if (err) {
      res.status(404).json({ error: "File not found" })
    }
  })
}

function filePath(folder, file) {
  return path.join(process.cwd(), Properties.storedFoldersName, folder, file)
}


module.exports = { download, handleArchive, storeArchive, folderPath, getMidiFile }
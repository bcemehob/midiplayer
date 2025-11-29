const path = require("path")
const fs = require("fs")
const fsp = require("fs/promises")
const unzipper = require("unzipper")
const multer = require("multer")
const Properties = require("./Properties")
const paths = require("./paths")
const events = require('./events')

const upload = multer({ dest: `${Properties.uploads}/` })
const storeArchive = upload.single("archive")

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
      .on("close", () => prepareSuccessResponse(res, true))
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Server error" })
  }
}

function prepareSuccessResponse(res, isNewArchive) {
  events.emit('projectChanged', {project: paths.timestamp})
  res.json({
    message: isNewArchive ? "Archive processed" : "Latest archive found",
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

function projects(_, res) {
  res.json(storedProjects().map(pr => ({ value: pr, label: pr })))
}

function project(req, res) {
  const { folder } = req.params
  console.log("FOLDER", folder)
  return bundle(folder, res)
}

function storedProjects() {
  const entries = fs.readdirSync(paths.folderPath, { withFileTypes: true })
  return entries
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .map(name => Number(name))
    .filter(num => !isNaN(num))
}

function bundle(folder, res) {
  paths.timestamp = folder
  paths.extract = path.join(Properties.storedFoldersName, paths.timestamp)
  const files = fs.readdirSync(path.join(paths.folderPath, paths.timestamp), { withFileTypes: true })
    .filter(entry => entry.isFile())
    .map(entry => entry.name)
  const midiFile = files.find(f => f.toLowerCase().endsWith('.mid') || f.toLowerCase().endsWith('.midi'))
  paths.midi = path.basename(midiFile)
  const audioFile = files.find(f => ['.mp3', '.wav', '.ogg'].some(ext => f.toLowerCase().endsWith(ext)))
  paths.audio = path.basename(audioFile)
  return prepareSuccessResponse(res)
}

function latestBundle(_, res) {
  const projects = storedProjects()
  if (!projects || !projects.length) {
    res.json({})
    return
  }
  try {
    return bundle(String(Math.max(...storedProjects())), res)
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

function deleteProject(req, res) {
  const { folder } = req.params
  folderPath = path.join(process.cwd(), Properties.storedFoldersName, folder)
  fs.rm(folderPath, { recursive: true, force: true }, (err) => {
    if (err) {
      console.error("Error deleting folder:", err)
    }
  })
  res.json({ result: "OK" })
}

function filePath(folder, file) {
  return path.join(process.cwd(), Properties.storedFoldersName, folder, file)
}

module.exports = {
  download,
  handleArchive,
  storeArchive,
  getMidiFile,
  latestBundle,
  projects,
  project,
  deleteProject
}
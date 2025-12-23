const path = require("path")
const fs = require("fs")
const fsp = require("fs/promises")
const unzipper = require("unzipper")
const multer = require("multer")
const properties = require("../../properties")
const paths = require("../../paths")
const events = require('../../events')
const AdmZip = require('adm-zip');
const zip = new AdmZip();


const upload = multer({ dest: `${properties.uploads}/` })
const storeArchive = upload.single("archive")

async function handleArchive(req, res) {
  try {
    const zipPath = req.file.path
    paths.timestamp = Date.now().toString()
    paths.extract = path.join(properties.storedFoldersName, paths.timestamp)
    fs.mkdirSync(paths.extract, { recursive: true })
    fs.createReadStream(zipPath)
      .pipe(unzipper.Parse())
      .on("entry", storeUnzippedEntry)
      .on("error", err => handleFileProcessingError(err, res))
      .on("close", () => {
        events.emit('projectChanged', { project: paths.timestamp })
        res.json(paths.successResponse(true))
      })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Server error" })
  }
}

function compressCurrentProject(_, res) {
  const projectPath = path.join(paths.folderPath, paths.timestamp)
  zip.addLocalFolder(projectPath)
  const pathToArchive = paths.archivePath()
  zip.writeZip(pathToArchive)
  downloadFile(pathToArchive, res)
}

function handleFileProcessingError(err, res) {
  console.log(err)
  res.status(500).json({ error: "Failed to unzip file" })
}

function storeUnzippedEntry(entry) {
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
  } else if (type === "File" && fileName.match(/\.json$/i)) {
    if (!paths.tracks) paths.tracks = []
    const filePath = path.basename(fileName)
    paths.tracks.push(filePath)
    entry.pipe(fs.createWriteStream(path.join(paths.extract, filePath)))
  } else {
    entry.autodrain()
  }
}

async function getFile(path) {
  return await fsp.readFile(path)
}

async function getOrCreateFile(path) {
  try {
    return await fsp.readFile(path, "utf8")
  } catch (err) {
    if (err.code !== 'ENOENT') throw err
    const content = "[]"
    await fsp.writeFile(path, content, "utf8")
    return content
  }
}

function download(req, res) {
  const { folder, file } = req.params
  downloadFile(filePath(folder, file), res)
}

function downloadFile(pathToArchive, res) {
  res.download(pathToArchive, (err) => {
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
  paths.extract = path.join(properties.storedFoldersName, paths.timestamp)
  const files = fs.readdirSync(path.join(paths.folderPath, paths.timestamp), { withFileTypes: true })
    .filter(entry => entry.isFile())
    .map(entry => entry.name)
  const midiFile = files.find(f => f.toLowerCase().endsWith('.mid') || f.toLowerCase().endsWith('.midi'))
  paths.midi = path.basename(midiFile)
  const audioFile = files.find(f => ['.mp3', '.wav', '.ogg'].some(ext => f.toLowerCase().endsWith(ext)))
  paths.audio = path.basename(audioFile)
  events.emit('projectChanged', { project: paths.timestamp })
  res.json(paths.successResponse())
}

function latestBundle(_, res) {
  const projects = storedProjects()
  if (!projects || !projects.length) {
    res.json({})
    return
  }
  if (paths.timestamp) {
    events.emit('projectChanged', { project: paths.timestamp })
    res.json(paths.successResponse())
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
  folderPath = path.join(process.cwd(), properties.storedFoldersName, folder)
  fs.rm(folderPath, { recursive: true, force: true }, (err) => {
    if (err) {
      console.error("Error deleting folder:", err)
    }
  })
  if (paths.timestamp === folder) paths.reset()
  res.json({ result: "OK" })
}

function filePath(folder, file) {
  return path.join(process.cwd(), properties.storedFoldersName, folder, file)
}

module.exports = {
  download,
  handleArchive,
  compressCurrentProject,
  storeArchive,
  getFile,
  getOrCreateFile,
  latestBundle,
  projects,
  project,
  deleteProject
}
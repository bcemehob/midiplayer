const path = require("path")
const fs = require("fs")
const fsp = require("fs/promises")
const multer = require("multer")
const properties = require("../../properties")
const paths = require("../../paths")
const events = require('../../events')
const AdmZip = require('adm-zip')
const zip = new AdmZip()

const upload = multer({ dest: `${properties.uploads}/` })
const storeArchive = upload.single("archive")

function compressCurrentProject(_, res) {
  zip.addLocalFolder(paths.currentFolderPath())
  const pathToArchive = paths.archivePath()
  zip.writeZip(pathToArchive)
  downloadFile(pathToArchive, res)
}

async function getFile(path) {
  return await fsp.readFile(path)
}

async function createTrackInfoFiles(tracks) {
  tracks.forEach((_, i) => createTrack(i))
}

async function createTrack(index) {
    const fileContent = '{"parties":[], "timeline":[]}'
    const fileName = paths.fullPath(`track_${index}.json`)
    await createFileIfNotExists(fileName, fileContent)
}

async function createFileIfNotExists(path, content) {
  try {
    await fsp.access(path)
  } catch (err) {
    if (err.code !== 'ENOENT') throw err
    await fsp.writeFile(path, content, "utf8")
  }
}

async function save(path, content) {
  await fsp.writeFile(path, content, "utf8")
}

function downloadAudio(_, res) {
  downloadFile(paths.fullAudioPath(), res)
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

function storedProjects() {
  const entries = fs.readdirSync(paths.folderPath(), { withFileTypes: true })
  return entries
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .map(name => Number(name))
    .filter(num => !isNaN(num))
}

function bundle(folder) {
  paths.timestamp = folder
  const files = fs.readdirSync(paths.currentFolderPath(), { withFileTypes: true })
    .filter(entry => entry.isFile())
    .map(entry => entry.name)
  console.log("Files, folder", files, folder)
  const midiFile = files.find(f => f.toLowerCase().endsWith('.mid') || f.toLowerCase().endsWith('.midi'))
  paths.midi = path.basename(midiFile)
  const audioFile = files.find(f => ['.mp3', '.wav', '.ogg'].some(ext => f.toLowerCase().endsWith(ext)))
  paths.audio = path.basename(audioFile)
  events.emit('projectChanged', { project: paths.timestamp })
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
    return res.status(500).json({ error: 'Internal server error' })
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

module.exports = {
  downloadAudio,
  compressCurrentProject,
  storeArchive,
  getFile,
  createFileIfNotExists,
  save,
  createTrackInfoFiles,
  latestBundle,
  projects,
  bundle,
  deleteProject
}
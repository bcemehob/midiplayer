const express = require("express")
const multer = require("multer")
const unzipper = require("unzipper")
const path = require("path")
const fs = require("fs")
const { Player } = require("midi-player-js")

let clients = []
const upload = multer({ dest: "uploads/" })
let currentPlayer = null


function createMidiServer() {
  const app = express()
  app.use(express.static("public"))
  app.use("/files", express.static(path.join(process.cwd(), "extracted")))
  app.post("/api/upload", storeArchive, handleArchive)
  app.get("/api/start", startBroadcastPlayback)
  app.get("/api/stop", stopPlayback)
  app.get("/api/events", registerUiClient)

  app.get("/api/download/:folder/:file", (req, res) => {
    const { folder, file } = req.params;
    const filePath = path.join(process.cwd(), "extracted", folder, file);

    res.download(filePath, file, (err) => {
      if (err) {
        res.status(404).json({ error: "File not found" });
      }
    });
  });
  return app
}

const startBroadcastPlayback = (req, res) => {
  const file = `extracted/${req.query.folder}/${req.query.file}`
  currentPlayer = new Player(eventEmitter)
  currentPlayer.loadFile(file)
  currentPlayer.play()
  res.send("Playback started")
}

const eventEmitter = event => {
  console.log("event", event)
  clients.forEach(client => client.write(`data: ${JSON.stringify(event)}\n\n`))
}

const registerUiClient = (req, res) => {
  res.setHeader("Content-Type", "text/event-stream")
  res.setHeader("Cache-Control", "no-cache")
  res.setHeader("Connection", "keep-alive")
  res.flushHeaders()
  clients.push(res)
  req.on("close", () => {
    clients = clients.filter(client => client !== res)
  })
}

const stopPlayback = (_, res) => {
  if (currentPlayer) currentPlayer.stop()
    res.send("Playback stopped")
}


const storeArchive = upload.single("archive")
const handleArchive = async (req, res) => {
  try {
    const zipPath = req.file.path
    const folderPath = Date.now().toString()
    const extractPath = path.join("extracted", folderPath)
    fs.mkdirSync(extractPath, { recursive: true })

    let midiFilePath = null;
    let audioFilePath = null;

    fs.createReadStream(zipPath)
      .pipe(unzipper.Parse())
      .on("entry", (entry) => {
        const fileName = entry.path
        const type = entry.type
        if (fileName.startsWith("__MACOSX/") || fileName.endsWith(".DS_Store")) {
          entry.autodrain();
          return;
        }

        if (type === "File" && fileName.match(/\.(mid|midi)$/i)) {
          midiFilePath = path.basename(fileName);
          entry.pipe(fs.createWriteStream(path.join(extractPath, midiFilePath)));
        } else if (type === "File" && fileName.match(/\.(mp3|wav|ogg)$/i)) {
          audioFilePath = path.basename(fileName)
          entry.pipe(fs.createWriteStream(path.join(extractPath, audioFilePath)));
        } else {
          entry.autodrain()
        }
      })
      .on("error", (err) => {
        console.error(err);
        res.status(500).json({ error: "Failed to unzip file" })
      })
      .on("close", () => {
        res.json({
          message: "Archive processed",
          folder: folderPath,
          midiFile: midiFilePath,
          audioFile: audioFilePath
        });
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" })
  }
}

module.exports = { createMidiServer }
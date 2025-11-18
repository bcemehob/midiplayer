const path = require("path")
const fs = require("fs")
const unzipper = require("unzipper")
const multer = require("multer")
const Properties = require("./Properties")

const upload = multer({ dest: `${Properties.uploads}/` })
const folderPath = path.join(process.cwd(), Properties.storedFoldersName)
const storeArchive = upload.single("archive")

function download (req, res) {
    const { folder, file } = req.params
    const filePath = path.join(process.cwd(), Properties.storedFoldersName, folder, file)

    res.download(filePath, file, (err) => { 
      if (err) {
        res.status(404).json({ error: "File not found" })
      }
    })
  }

  async function handleArchive(req, res) {
  try {
    const zipPath = req.file.path
    const folderPath = Date.now().toString()
    const extractPath = path.join(Properties.storedFoldersName, folderPath)
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

  module.exports = { download, handleArchive, storeArchive, folderPath }
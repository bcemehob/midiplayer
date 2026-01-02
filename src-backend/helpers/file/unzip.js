const path = require("path")
const paths = require("../../paths")
const fs = require("fs")
const unzipper = require("unzipper")


function unzipArchive(zipPath) {
    fs.mkdirSync(paths.currentFolderPath(), { recursive: true })
    return new Promise((resolve, reject) => {
        const parser = unzipper.Parse()
        parser
            .on("entry", storeUnzippedEntry)
            .on("error", reject)
            .on("close", resolve);

        fs.createReadStream(zipPath).pipe(parser);
    })
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
        entry.pipe(fs.createWriteStream(paths.fullMidiPath()))
    } else if (type === "File" && fileName.match(/\.(mp3|wav|ogg)$/i)) {
        paths.audio = path.basename(fileName)
        entry.pipe(fs.createWriteStream(paths.fullAudioPath()))
    } else if (type === "File" && fileName.match(/\.json$/i)) {
        if (!paths.tracks) paths.tracks = []
        const filePath = path.basename(fileName)
        paths.tracks.push(filePath)
        entry.pipe(fs.createWriteStream(paths.fullPath(filePath)))
    } else {
        entry.autodrain()
    }
}

module.exports = { unzipArchive }

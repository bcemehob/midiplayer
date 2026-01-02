const paths = require("../paths")
const { getOrCreateFile, createFileIfNotExists } = require("./file/file")

async function track(req, res) {
    const { index } = req.params
    const fileName = paths.fullPath(`track_${index}.json`)
    const fileContent = await getOrCreateFile(fileName)
    console.log(fileContent)
    res.json(JSON.parse(fileContent))
}

async function createTrack(index) {
    const fileContent = '{"parties":[], "timeline":[]}'
    const fileName = paths.fullPath(`track_${index}.json`)
    await createFileIfNotExists(fileName, fileContent)

}

module.exports = { track }
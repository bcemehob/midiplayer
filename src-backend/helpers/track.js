const paths = require("../paths")
const { getFile } = require("./file/file")

async function track(req, res) {
    const { index } = req.params
    const fileName = paths.fullPath(`track_${index}.json`)
    const fileContent = await getFile(fileName)
    console.log(fileContent)
    res.json(JSON.parse(fileContent))
}


module.exports = { track }
const paths = require("../paths")
const { getFile } = require("./file/file")

async function track(req, res) {
    const { index } = req.params
    const fileName = paths.fullPath(`track_${index}.json`)
    const fileContent = await getFile(fileName)
    res.json(JSON.parse(fileContent))
}

async function addPartyElement(req, res) {
    console.log(req.params, req.body)
    res.json({result: "OK"})
}


module.exports = { track, addPartyElement }
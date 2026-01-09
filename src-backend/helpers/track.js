const paths = require("../paths")
const { getFile, save } = require("./file/file")

async function track(req, res) {
    const { index } = req.params
    const fileContent = await getFile(paths.fullTrackInfoPath(index))
    res.json(JSON.parse(fileContent))
}

async function addPartyElement(req, res) {
    const filePath = paths.fullTrackInfoPath(req.params.index)
    const fileContent = await getFile(filePath)
    const trackInfo = JSON.parse(fileContent.toString())
    const party = new Party(trackInfo.parties.length, req.body.name, '', req.body.duration)
    const timelineElement = new TimelineElement(trackInfo.timeline.length, party.id, req.body.start)
    trackInfo.parties.push(party)
    trackInfo.timeline.push(timelineElement)
    await save(filePath, JSON.stringify(trackInfo))
    res.json({ result: "OK" })
}

class Party {
    constructor(id, name, description, duration){
        this.id = id
        this.name = name
        this.description = description
        this.duration = duration
    }
}

class TimelineElement {
    constructor(id, partyId, start) {
        this.id = id
        this.partyId = partyId
        this.start = start
    }
}

module.exports = { track, addPartyElement }
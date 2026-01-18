const paths = require("../../paths")
const { getFile, save } = require("../file/file")
const { TrackInfo, Party, TimelineElement } = require("./TrackInfo")

async function track(req, res) {
    const { index } = req.params
    const fileContent = await getFile(paths.fullTrackInfoPath(index))
    res.json(JSON.parse(fileContent))
}

async function addPartyElement(req, res) {
    const filePath = paths.fullTrackInfoPath(req.params.index)
    const fileContent = await getFile(filePath)
    const trackInfo = Object.assign(new TrackInfo(), JSON.parse(fileContent.toString()))
    const party = new Party(trackInfo.parties.length, req.body.name, '', req.body.duration)
    const timelineElement = new TimelineElement(trackInfo.timeline.length, party.id, req.body.start)
    if (!trackInfo.canAddToTimeline(party, timelineElement)) {
        return res.status(400).json({ error: "Timeline element overlaps with existing elements" })
    }
    trackInfo.parties.push(party)
    trackInfo.timeline.push(timelineElement)
    await save(filePath, JSON.stringify(trackInfo))
    res.json({ result: "OK" })
}

module.exports = { track, addPartyElement }
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
    const party = findOrCreateParty(trackInfo, req.body)
    const timelineElement = new TimelineElement(Date.now(), party.id, req.body.start)
    if (!trackInfo.canAddToTimeline(party, timelineElement)) {
        return res.status(400).json({ error: "Timeline element overlaps with existing elements" })
    }
    trackInfo.timeline.push(timelineElement)
    await save(filePath, JSON.stringify(trackInfo))
    res.json({ result: "OK" })
}

function findOrCreateParty(trackInfo, requestBody) {
    const { partyId, name, description, duration } = requestBody
    if (partyId !== undefined) {
        return trackInfo.getParty(partyId)
    }
    const party = new Party(Date.now(), name, description, duration)
    trackInfo.parties.push(party)
    return party
}

async function deletePartyElement(req, res) {
    const { index, elementId } = req.params
    if (isNaN(elementId)) {
        return res.status(400).json({ error: "Invalid element ID" })
    }
    const filePath = paths.fullTrackInfoPath(index)
    const fileContent = await getFile(filePath)
    const trackInfo = Object.assign(new TrackInfo(), JSON.parse(fileContent.toString()))
    const elementIndex = trackInfo.timeline.findIndex(el => el.id === elementId * 1)
    if (elementIndex === -1) {
        return res.status(404).json({ error: "Timeline element not found" })
    }
    trackInfo.timeline.splice(elementIndex, 1)
    await save(filePath, JSON.stringify(trackInfo))
    return res.json({ result: "OK" })
}

module.exports = { track, addPartyElement, deletePartyElement }
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
    try {
        deleteElementById(trackInfo, elementId)
        saveFile(filePath, trackInfo, res)
    } catch (err) {
        return res.status(404).json({ error: "Timeline element not found" })
    }
}

async function saveFile(filePath, object, res) {
    await save(filePath, JSON.stringify(object))
    return res.json({ result: "OK" })
}

function deleteElementById(trackInfo, elementId) {
    const elementIndex = trackInfo.timeline.findIndex(el => el.id === elementId * 1)
    if (elementIndex === -1) throw new Error("Timeline element not found")
    trackInfo.timeline.splice(elementIndex, 1)
}

function findElementsByPartyId(trackInfo, partyId) {
    return trackInfo.timeline.filter(el => el.partyId === partyId * 1)
}

function deletePartyById(trackInfo, partyId) {
    const partyIndex = trackInfo.parties.findIndex(p => p.id === partyId * 1)
    if (partyIndex === -1) throw new Error("Party not found")
    trackInfo.parties.splice(partyIndex, 1)
}

async function deleteParty(req, res) {
    const { index, partyId } = req.params
    const filePath = paths.fullTrackInfoPath(index)
    const fileContent = await getFile(filePath)
    const trackInfo = Object.assign(new TrackInfo(), JSON.parse(fileContent.toString()))
    try {
        deletePartyById(trackInfo, partyId)
    } catch (err) {
        return res.status(404).json({ error: err.data })
    }
    const elements = findElementsByPartyId(trackInfo, partyId)
    console.log("elements to delete:", elements)
    elements.forEach(el => {
        try {
            deleteElementById(trackInfo, el.id)
        } catch (err) { }
    })
    saveFile(filePath, trackInfo, res)
}

module.exports = { track, addPartyElement, deletePartyElement, deleteParty }
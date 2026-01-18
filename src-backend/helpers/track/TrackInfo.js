class TrackInfo {
    constructor() {
        this.parties = []
        this.timeline = []
    }
    getParty(partyId) {
        return this.parties.find(p => p.id === partyId)
    }
    canAddToTimeline(party, timelineElement) {
        for (const element of this.timeline) {
            const existingParty = this.getParty(element.partyId)
            if (element.start < timelineElement.start + party.duration
                && element.start + existingParty.duration > timelineElement.start) {
                return false
            }
        }
        return true
    }
}

class Party {
    constructor(id, name, description, duration) {
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
module.exports = { TrackInfo, Party, TimelineElement }
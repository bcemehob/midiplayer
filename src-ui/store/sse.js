// @ts-nocheck
import { writable } from "svelte/store"

export const midiEvent = writable(0)
export const midiEvents = writable([])
window.addEventListener("sse-update", (e) => {
    midiEvent.set(e.detail)
    const trackId = e.detail.track
    midiEvents.update(events => {
        const updatedEvents = { ...events }
        if (!updatedEvents[trackId]) {
            updatedEvents[trackId] = []
        }
        updatedEvents[trackId] = [...updatedEvents[trackId], event.detail]
        return updatedEvents
    });
});
// @ts-nocheck
import { midiEvent, currentTimeMs, latestStartTick } from "../store";
import { get } from "svelte/store"; // to safely read store values

export async function goToTick(tick) {
  midiEvent.set({ tick })

  const res = await fetch(`/api/jump?tick=${tick}`)
  const data = await res.json()

  if ((!!data.currentTimeMs || data.currentTimeMs === 0) && !Number.isNaN(data.currentTimeMs)) {
    const ms = Number(data.currentTimeMs)
    currentTimeMs.set(ms)
    latestStartTick.set(tick)
  }
}
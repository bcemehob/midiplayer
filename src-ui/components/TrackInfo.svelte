<script>
  // @ts-nocheck
  import { onMount } from "svelte"
  import { offset } from "../helpers/timeline"
  import properties from "../properties"
  import { totalTicks, latestStartTick } from "../store"
  import PartyElement from "./PartyElement.svelte"
  import Modal from "./Modal.svelte"
  import AddPartyElementModalContent from "./AddPartyElementModalContent.svelte"
  import TrackParties from "./TrackParties.svelte"
  import TrackPartyElements from "./TrackPartyElements.svelte"

  export let index
  export let track

  let rawParties
  let partyElements
  let lastUpdate
  let isModalOpen = false

  $: if (track || lastUpdate) loadTrack()

  async function loadTrack() {
    const res = await fetch(`/api/track/${index}`)
    rawParties = await res.json()

    if (rawParties.timeline) {
      partyElements = rawParties.timeline.map(partyElementView)
    }
  }

  function getParty(id) {
    return rawParties.parties.find((p) => p.id === id)
  }

  function partyElementView(timelineElement) {
    return {
      ...getParty(timelineElement.partyId),
      start: timelineElement.start,
      timelineElementId: timelineElement.id,
      trackIndex: index,
    }
  }
</script>

{#if rawParties}
  <TrackParties parties={rawParties.parties} />
  <TrackPartyElements on:element-saved={loadTrack} {partyElements} {index} {track} parties={rawParties.parties} />
{/if}

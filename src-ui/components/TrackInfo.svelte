<script>
  // @ts-nocheck
  import { onMount } from "svelte"
  import TrackParties from "./TrackParties.svelte"
  import TrackPartyElements from "./TrackPartyElements.svelte"

  export let index
  export let track

  let rawParties
  let partyElements
  let isModalOpen = false

  onMount(() => {
    loadTrack()
  })

  $: partyElements = rawParties?.timeline?.map(partyElementView) || []

  async function loadTrack() {
    const res = await fetch(`/api/track/${index}`)
    rawParties = await res.json()
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
  <TrackParties
    parties={rawParties.parties}
    {index}
    on:party-changed={loadTrack}
  />
  <TrackPartyElements
    on:element-changed={loadTrack}
    {partyElements}
    {index}
    {track}
    parties={rawParties.parties}
  />
{/if}

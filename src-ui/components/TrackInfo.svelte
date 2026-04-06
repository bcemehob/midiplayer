<script>
  // @ts-nocheck
  import { onMount } from "svelte"
  import TrackParties from "./TrackParties.svelte"
  import TrackPartyElements from "./TrackPartyElements.svelte"

  let { index, track } = $props()

  let rawParties = $state(undefined)
  let partyElements = $derived(rawParties?.timeline?.map(partyElementView) || [])

  onMount(() => {
    loadTrack()
  })

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
    {track} 
    on:party-changed={loadTrack}
  />
  {#key partyElements}
  <TrackPartyElements
    on:element-changed={loadTrack}
    {partyElements}
    {index}
    {track}
    parties={rawParties.parties}
  />
  {/key}
{/if}

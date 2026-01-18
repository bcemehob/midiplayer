<script>
  // @ts-nocheck
  import { onMount } from "svelte"
  import { offset } from "../helpers/timeline"
  import { totalTicks, latestStartTick } from "../store"
  import Party from "./Party.svelte"
    import Modal from "./Modal.svelte"

  export let index
  export let track

  let rawParties
  let partyViews
  let lastUpdate
  let currentPayload
  let isModalOpen = false

  $: if (track || lastUpdate) {
    loadTrack(index)
  }

  async function loadTrack(index) {
    const res = await fetch(`/api/track/${index}`)
    rawParties = await res.json()

    if (rawParties.timeline) {
      partyViews = rawParties.timeline.map(mergePartyView)
    }
  }

  function initSaveParty() {
    const partiesCount = rawParties?.parties?.length || 0
    currentPayload = {
      start: $latestStartTick,
      name: track.name + partiesCount,
      duration: 3600
    }
    isModalOpen = true
  }

  function closeModal() {
    isModalOpen = false
  }

  function submit(){
    console.log("submitting", currentPayload)
    isModalOpen = false
    savePartyElement()
  }

  async function savePartyElement() {
    await fetch(`/api/track/${index}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentPayload),
    })
    lastUpdate = Date.now()
  }

  function getParty(id) {
    return rawParties.parties.find((p) => p.id === id)
  }

  function mergePartyView(timelineElement) {
    return {
      ...getParty(timelineElement.partyId),
      start: timelineElement.start,
    }
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="track-info" on:click={initSaveParty}>
  Track {index} info
  {#each partyViews as party}
    <Party {party} />
  {/each}
</div>
<Modal isOpen={isModalOpen} close={closeModal} title="Add party to timeline" submit={submit}>
  <div>start: {currentPayload.start}</div>
  <div>name: {currentPayload.name}</div>
  <div>duration: {currentPayload.duration}</div>
</Modal>

<style>
  .track-info {
    font-size: 7pt;
    border: 1px solid lavender;
    padding: 3px;
    line-height: 5pt;
    cursor: pointer;
  }
</style>

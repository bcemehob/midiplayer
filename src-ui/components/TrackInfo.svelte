<script>
  // @ts-nocheck
  import { onMount } from "svelte"
  import { offset } from "../helpers/timeline"
  import { totalTicks, latestStartTick } from "../store"
  import Party from "./Party.svelte"
  import Modal from "./Modal.svelte"
  import AddPartyModalContent from "./AddPartyModalContent.svelte"

  export let index
  export let track

  let rawParties
  let partyViews
  let lastUpdate
  let currentPayload
  let isModalOpen = false
  let selectedParty

  $: if (track || lastUpdate) loadTrack()

  async function loadTrack() {
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
      duration: 3600,
    }
    isModalOpen = true
  }

  function closeModal() {
    isModalOpen = false
  }

  function submit() {
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
      timelineElementId: timelineElement.id,
      trackIndex: index,
    }
  }
</script>

{#if rawParties}
  <div class="parties">
    {#each rawParties.parties as party}
      <div class="party">{party.id}</div>
    {/each}
  </div>
{/if}
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="track-info" on:click={initSaveParty}>
  Track {index} info
  {#each partyViews as party}
    <Party {party} on:element-deleted={loadTrack} />
  {/each}
</div>
<Modal
  isOpen={isModalOpen}
  close={closeModal}
  title="Add party to timeline"
  {submit}
>
  <AddPartyModalContent {currentPayload} {rawParties} />
</Modal>

<style>
  .track-info {
    position: relative;
    font-size: 9pt;
    border: 1px solid lavender;
    padding: 3px;
    line-height: 5pt;
    cursor: pointer;
  }
  .two-columns {
    display: flex;
    gap: 2rem; /* space between columns */
  }

  .left,
  .right {
    flex: 1; /* equal width columns */
    display: flex;
    flex-direction: column;
    gap: 0.5rem; /* spacing between items */
  }
  label {
    display: flex;
    flex-direction: column;
    font-size: 9pt;
    font-weight: bold;
  }
  .parties {
    display: flex;
    margin: 0.5em;
    font-size: 9pt;
    color: #ccd;
  }
  .parties .party {
    margin-right: 0.2em;
    background-color: #444;
    padding: 0 0.6em;
    border-radius: 0.4em;
    cursor: pointer;
  }
</style>

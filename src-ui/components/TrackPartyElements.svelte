<script>
  // @ts-nocheck
  import Modal from "./Modal.svelte"
  import PartyElement from "./PartyElement.svelte"
  import AddPartyElementModalContent from "./AddPartyElementModalContent.svelte"
  import { latestStartTick } from "../store"
  import { createEventDispatcher } from "svelte"

  export let index
  export let track
  export let parties
  export let partyElements

  let isModalOpen = false
  let currentPayload
  const dispatch = createEventDispatcher()

  function closeModal() {
    isModalOpen = false
  }

  function submit() {
    isModalOpen = false
    savePartyElement()
  }

  function initSaveParty() {
    currentPayload = {
      start: $latestStartTick,
      name: track.name + " " + Date.now(),
      duration: 3600,
    }
    isModalOpen = true
  }

  async function savePartyElement() {
    await fetch(`/api/track/${index}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentPayload),
    })
    dispatch("element-saved")
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="track-info" on:click={initSaveParty}>
  Track {index} info
  {#each partyElements as party}
    <PartyElement
      {party}
      on:element-deleted={() => dispatch("element-deleted")}
    />
  {/each}
</div>
<Modal
  isOpen={isModalOpen}
  close={closeModal}
  title="Add party to timeline"
  {submit}
>
  <AddPartyElementModalContent {currentPayload} {parties} />
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
</style>

<script>
  // @ts-nocheck
  import Party from "./Party.svelte"
  import Modal from "./Modal.svelte"
  import AddPartyElementModalContent from "./AddPartyElementModalContent.svelte"
  import { createEventDispatcher } from "svelte"
  import { latestStartTick } from "../store"

  const dispatch = createEventDispatcher()

  export let parties
  export let index
  export let track

  let isModalOpen = false
  let currentPayload

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
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentPayload),
    })
    dispatch("party-changed")
  }
</script>

<div class="parties">
  {#if parties}
    {#each parties as party}
      <Party
        {party}
        {index}
        on:party-deleted={() => dispatch("party-changed")}
        on:element-added={() => dispatch("party-changed")}
      />
    {/each}
  {/if}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="add-party" on:click={initSaveParty}>+</div>
</div>

<Modal
  isOpen={isModalOpen}
  close={closeModal}
  title="Add party to timeline"
  {submit}
>
  <AddPartyElementModalContent {currentPayload} />
</Modal>

<style>
  .parties {
    display: flex;
    margin: 0.5em;
    margin-bottom: 2em;
    font-size: 9pt;
    color: #ccd;
  }
  .add-party {
    width: 1em;
    height: 1em;
    line-height: 0.8em;
    font-size: 15pt;
    text-align: center;
    border: 2px dashed #aaa;
    color: #aaa;
    border-radius: 0.2em;
    margin-left: 0.2em;
    cursor: pointer;
  }
  .add-party:hover {
    border-color: #777;
    color: #777;
  }
</style>

<script>
  // @ts-nocheck
  import RecycleBin from "./icons/RecycleBin.svelte"
  import Modal from "./Modal.svelte"
  import AddPartyElementModalContent from "./AddPartyElementModalContent.svelte"
  import properties from "../properties"
  import { createEventDispatcher } from "svelte"
  import { shorten } from "../util/text"
  import Add from "./icons/Add.svelte"
  import { latestStartTick } from "../store"
  const dispatch = createEventDispatcher()

  export let index
  export let party

  let isModalOpen = false
  let currentPayload

  function closeModal() {
    isModalOpen = false
  }

  function submit() {
    isModalOpen = false
    saveElement()
  }

  function initAddElement() {
    currentPayload = {
      start: $latestStartTick,
      partyId: party.id,
    }
    isModalOpen = true
  }

  const getBgColor = () => {
    return properties.partyColors[party.id % properties.partyColors.length][0]
  }

  const getColor = () => {
    return properties.partyColors[party.id % properties.partyColors.length][1]
  }

  function partyStyle() {
    return `background-color: ${getBgColor(party.id)};color: ${getColor(party.id)}`
  }

  async function saveElement() {
    await fetch(`/api/track/${index}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentPayload),
    })
    dispatch("element-added")
  }

  function initSaveParty() {
    currentPayload = {
      start: $latestStartTick,
      partyId: party.id,
    }
    isModalOpen = true
  }

  async function deleteParty(party) {
    if (!confirm("Are you sure you want to delete this party?")) return
    await fetch(`/api/track/${index}/party/${party.id}`, { method: "DELETE" })
    dispatch("party-deleted")
  }
</script>

<div class="party" style={partyStyle(party)}>
  <div class="party-menu">
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="party-menu">
      <div on:click|stopPropagation={() => initAddElement()}>
        <Add color={getColor(party.id)} width="16" height="16" />
      </div>
      <div on:click|stopPropagation={() => deleteParty(party)}>
        <RecycleBin color={getColor(party.id)} width="16" height="16" />
      </div>
    </div>
  </div>
  <div>{shorten(party.id, 4)}</div>
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
  .party {
    position: relative;
    margin-right: 0.6em;
    background-color: #444;
    padding: 0 0.6em;
    border-radius: 0.4em;
    cursor: pointer;
  }
  .party .party-menu {
    position: absolute;
    display: flex;
    background-color: inherit;
    border-top-left-radius: 15%;
    border-top-right-radius: 15%;
    padding: 0.1em;
    top: -1.14em;
    right: 0;
    font-weight: bold;
    visibility: hidden;
  }
  .party .party-menu div {
    padding: 0.2em;
  }
  .party:hover .party-menu {
    visibility: visible;
  }
</style>

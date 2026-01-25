<script>
  // @ts-nocheck
  import { createEventDispatcher } from "svelte"
  import { offset, length } from "../helpers/timeline"
  import { totalTicks } from "../store"
  import RecycleBin from "./icons/RecycleBin.svelte"
  import Modal from "./Modal.svelte"
  export let party

  let isModalOpen = false
  const dispatch = createEventDispatcher()

  function getStyle() {
    return `${offset(party.start, $totalTicks)};${length(party.duration, $totalTicks)}`
  }

  function editParty() {
    console.log("Edit party", party.id)
    isModalOpen = true
  }

  function closeModal() {
    isModalOpen = false
  }

  function submit() {
    isModalOpen = false
  }

  async function deleteElement() {
    if (!confirm("Are you sure you want to delete this item?")) return
    await fetch(
      `/api/track/${party.trackIndex}/element/${party.timelineElementId}`,
      { method: "DELETE" },
    )
    dispatch("element-deleted")
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="party" style={getStyle()} on:click|stopPropagation={editParty}>
  id: {party.id}
  {party.name}
  <div class="party-menu" on:click|stopPropagation={() => deleteElement(party)}>
    <RecycleBin width="16" height="16" />
  </div>
</div>

<Modal isOpen={isModalOpen} close={closeModal} title="Edit party" {submit}>
  <div class="left">
    <div>Party: {party.name}</div>
    <div>start: {party.start}</div>
    <div>name: {party.name}</div>
    <div>duration: {party.duration}</div>
  </div>
</Modal>

<style>
  .party {
    position: absolute;
    display: inline-block;
    background-color: #7b7253;
    border-top-left-radius: 0.4em;
    border-top-right-radius: 0.4em;
    border-bottom-right-radius: 0.4em;
    border-bottom-left-radius: 0.4em;
    height: 2em;
    padding: 0.2em 0.4em;
    color: #fff;
    font-weight: bold;
    top: -0.45em;
  }
  .party-menu {
    position: absolute;
    top: -1.6em;
    right: 0;
    background-color: #7b7253;
    border-top-left-radius: 15%;
    border-top-right-radius: 15%;
    padding: 0.1em;
    padding-bottom: 0.2em;
    cursor: pointer;
    visibility: hidden;
  }

  .party:hover {
    border-top-right-radius: 0;
  }
  .party:hover .party-menu {
    visibility: visible;
  }
</style>

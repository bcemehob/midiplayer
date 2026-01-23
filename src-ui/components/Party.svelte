<script>
  // @ts-nocheck
  import { offset, length } from "../helpers/timeline"
  import { totalTicks } from "../store"
  import Modal from "./Modal.svelte"
  export let party

  let isModalOpen = false

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
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="party" style={getStyle()} on:click|stopPropagation={editParty}>
  id: {party.id}
  {party.name}
</div>
<Modal
  isOpen={isModalOpen}
  close={closeModal}
  title="Edit party"
  {submit}
>
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
    border: 1px solid blue;
    height: 2em;
  }
</style>

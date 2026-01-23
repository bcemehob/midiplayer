<script>
  // @ts-nocheck
  import { modalOpen } from "./../store/index.js"
  export let title
  export let submit
  export let isOpen
  export let close
  $: if (isOpen) {
    modalOpen.set(true)
  }
</script>

{#if isOpen}
  <div id="partyModal" class="modal">
    <div class="header">
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div class="close" on:click|stopPropagation={() => {modalOpen.set(false); close()}}>
        <svg viewBox="0 0 24 24" stroke="red" stroke-width="2">
          <line x1="5" y1="5" x2="19" y2="19" />
          <line x1="19" y1="5" x2="5" y2="19" />
        </svg>
      </div>
    </div>
    <h5>{title}</h5>
    <div class="modal-body">
      <slot />
    </div>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <button on:click|stopPropagation={() => {modalOpen.set(false); submit()}}>ok</button>
  </div>
{/if}

<style>
  .modal {
    width: 50%;
    font-size: 10pt;
    line-height: 1.4em;
  }
  .modal .header {
    float: right;
    width: 100%;
    position: absolute;
    left: -0.1em;
    top: -0.1em;
    height: 1.7em;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    background-color: #bfbfa5;
  }
  .modal .header .close {
    position: absolute;
    margin: 0;
    right: 0.1em;
    width: 1.7em;
    height: 1.7em;
    border-top-right-radius: 12px;
    cursor: pointer;
  }
  .modal .header .close svg {
    stroke: #7f7f55;
  }
  .modal .header .close:hover svg {
    stroke: #4f4f25;
  }
  .modal button {
    background-color: #bfbfa5;
    color: #4f4f25;
  }
  .modal button:hover {
    background-color: #9f9f75;
  }
</style>

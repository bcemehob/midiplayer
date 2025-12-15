<script>
  // @ts-nocheck
  import { onMount } from "svelte"
  import { offset } from "../helpers/timeline"
  import { totalTicks } from "../store"
  import Party from "./Party.svelte"

  export let index

  let rawParties
  let partyViews

  function addInfo() {
    console.log("ADD for track ", index)
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

  onMount(async () => {
    const res = await fetch(`/api/track/${index}`)
    rawParties = await res.json()
    if (!rawParties.timeline) return
    partyViews = rawParties.timeline.map(mergePartyView)
  })
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="track-info" on:click={addInfo}>
  Track {index} info
  {#each partyViews as party}
    <Party {party} />
  {/each}
</div>

<style>
  .track-info {
    font-size: 7pt;
    border: 1px solid lavender;
    padding: 3px;
    line-height: 5pt;
    cursor: pointer;
  }
</style>

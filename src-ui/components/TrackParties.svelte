<script>
  // @ts-nocheck
  import Party from "./Party.svelte"
  import { createEventDispatcher } from "svelte"
  const dispatch = createEventDispatcher()

  export let parties
  export let index
</script>

{#if parties}
  <div class="parties">
    {#each parties as party}
      <Party {party} {index}       
      on:party-deleted={() => dispatch("party-changed")}/>
    {/each}
  </div>
{/if}

<style>
  .parties {
    display: flex;
    margin: 0.5em;
    margin-bottom: 2em;
    font-size: 9pt;
    color: #ccd;
  }
</style>

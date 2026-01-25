<script>
  // @ts-nocheck
  import Party from "./Party.svelte"

  export let parties
</script>

{#if parties}
  <div class="parties">
    {#each parties as party}
      <Party {party} />
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

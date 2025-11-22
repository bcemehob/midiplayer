<script>
  // @ts-nocheck
  import { onMount } from "svelte"

  export let analyzis = null
</script>

<div class="card timeline">
  <h3>Track Timeline:</h3>
  {#if analyzis}
    <div class="full-timeline">
      {#each analyzis.tempos as tempo}
        <div class="tempo">tempo: {tempo.bpm}</div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
  .event {
    background-color: antiquewhite;
    color: #777;
    margin: 3px;
  }
  .event td {
    border: 1px solid gray;
  }
  .tracks {
    display: inline-block;
  }
</style>

<script>
  export let currentPayload
</script>

<div class="two-columns">
  <div class="left">
    <h5>Add Party</h5>

    <div>start: {currentPayload.start}</div>
    <div>name: {currentPayload.name}</div>
    <div>duration: {currentPayload.duration}</div>
  </div>

  <div class="right">
    {#if currentPayload.partyId === undefined}
      <label>
        Name:
        <input type="text" bind:value={currentPayload.name} />
      </label>

      <label>
        Description:
        <input type="text" bind:value={currentPayload.description} />
      </label>
    {/if}
  </div>
</div>

<style>
  .two-columns {
    display: flex;
    gap: 2rem; /* space between columns */
  }

  .left,
  .right {
    flex: 1; /* equal width columns */
    display: flex;
    flex-direction: column;
    gap: 0.5rem; /* spacing between items */
  }
</style>

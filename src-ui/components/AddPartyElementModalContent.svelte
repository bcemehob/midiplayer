<script>
  export let currentPayload
  export let parties
</script>

<div class="two-columns">
  <div class="left">
    <label
      >Party:
      <select bind:value={currentPayload.partyId}>
        <option value={undefined}>new party</option>
        {#each parties as party}
          <option value={party.id}>{party.id} {party.name}</option>
        {/each}
      </select>
    </label>

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

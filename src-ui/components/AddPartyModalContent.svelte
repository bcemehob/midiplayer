  <script>
      export let currentPayload
      export let rawParties

  </script>
  
  <div class="two-columns">
    <div class="left">
      <label>Party:
      <select bind:value={currentPayload.partyId}>
        <option value={undefined}>new party</option>
        {#each rawParties.parties as party}
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
<script>
  // @ts-nocheck
  export let track = null
  export let index = null
  export let totalTicks = 0
  const colors = ["#e9fff8", "#ffe9f8", "#f8e9ff"]
</script>

<div class="track-label" style="top: {(index + 1) * 60}px">
  Instrument: {track.name}
</div>
<div class="track-info">track info</div>
<div
  class="track"
  style="top: {(index + 1) * 60}px; background-color: {colors[index]}"
>
  <div style="position: relative">
    {#each track.notes as note}
      <span
        class="note"
        style="left: {(note.ticks * 100) / totalTicks}%; top: 10px;"
      >
        ◆
      </span>
    {/each}
  </div>
  <div>&nbsp;</div>
</div>

<style>
  .track {
    border: 1px solid #cacae6;
    margin: 0.5em 0;
    padding: 0.5em 0;
  }
  .track-label {
    font-weight: bold;
    color: #642;
    font-size: 8pt;
  }
  .track-info{
    font-size: 7pt;
    border: 1px solid lavender;
    padding: 3px;
    line-height: 5pt;
  }
  .note {
    position: absolute;
    font-size: 5pt;
  }
</style>

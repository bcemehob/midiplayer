<script>
  // @ts-nocheck
  import TrackInfo from "./TrackInfo.svelte"
  import { offset } from "../helpers/timeline"
  import { totalTicks } from "../store"

  export let track = null
  export let index = null
  const colors = ["#e9fff8", "#ffe9f8", "#f8e9ff"]
</script>

<div class="track-label" style="top: {(index + 1) * 60}px">
  Instrument: {track.name}
</div>
<TrackInfo {track} {index} />
<div
  class="track"
  style="top: {(index + 1) * 60}px; background-color: {colors[index]}"
>
  <div style="position: relative">
    {#each track.notes as note}
      <span
        class="note"
        style={`${offset(note.ticks, $totalTicks)}; top: 10px;`}
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
    font-size: 10pt;
    padding: 0.7em 0;
    margin-bottom: 0.5em;
  }
  .note {
    position: absolute;
    font-size: 5pt;
  }
</style>

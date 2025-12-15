<script>
// @ts-nocheck
  import { offset, length } from "../helpers/timeline"
  import { totalTicks } from "../store"
  export let party
  function getStyle() {
    return `${offset(party.start, $totalTicks)};${length(party.duration, $totalTicks)}`
  }
</script>

<div class="party" style={getStyle()}>id: {party.id} {party.name}</div>

<style>
  .party {
    position: absolute;
    display: inline-block;
    border: 1px solid blue;
  }
</style>

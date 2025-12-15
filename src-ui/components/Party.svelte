<script>
  import { offset, length } from "../helpers/timeline"
  import { totalTicks } from "../store"
  export let party
</script>

<div class="party" style={`${offset(party.ticks, $totalTicks)};${length(party.duration, $totalTicks)}`}>{party.name}</div>

<style>
  .party {
    position: absolute;
    display: inline-block;
    border: 1px solid blue;
  }
</style>

<script>
  // @ts-nocheck
  import properties from "../properties"

  export let party

  function partyStyle(party) {
    return `background-color: ${properties.partyColors[party.id % properties.partyColors.length][0]};
            color: ${properties.partyColors[party.id % properties.partyColors.length][1]}`
  }
</script>

<div class="party" style={partyStyle(party)}>{party.id}</div>

<style>
  .party {
    margin-right: 0.6em;
    background-color: #444;
    padding: 0 0.6em;
    border-radius: 0.4em;
    cursor: pointer;
  }
</style>

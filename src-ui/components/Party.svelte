<script>
  // @ts-nocheck
  import RecycleBin from "./icons/RecycleBin.svelte"
  import properties from "../properties"

  export let party

  const getBgColor = partyId => {
    return properties.partyColors[partyId % properties.partyColors.length][0]
  }
 
  const getColor = partyId => {
    return properties.partyColors[partyId % properties.partyColors.length][1]
  }

  function partyStyle(party) {
    return `background-color: ${getBgColor(party.id)};color: ${getColor(party.id)}`
  }

  function shorten(input, maxLength) {
    const text = String(input)
    const ret = text.length > maxLength ? text.substring(0, maxLength) + "..." : text
    return ret
  }
</script>
<div class="party" style={partyStyle(party)}>
  <div class="party-menu">
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="party-menu" on:click|stopPropagation={() => deleteParty(party)}>
      <RecycleBin color={getColor(party.id)} width="16" height="16" />
    </div>
  </div>
  <div>{shorten(party.id, 4)}</div>
</div>

<style>
  .party {
    position: relative;
    margin-right: 0.6em;
    background-color: #444;
    padding: 0 0.6em;
    border-radius: 0.4em;
    cursor: pointer;
  }
  .party .party-menu {
    position: absolute;
    background-color: inherit;
    border-top-left-radius: 15%;
    border-top-right-radius: 15%;
    padding: 0.1em;
    top: -0.85em;
    right: 0;
    font-weight: bold;
    visibility: hidden;
  }
  .party:hover .party-menu {
    visibility: visible;
  }
  
</style>

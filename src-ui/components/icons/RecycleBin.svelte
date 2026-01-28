<script>
  // @ts-nocheck
  export let color = "red"
  let hovered = false

  $: dynamicStyle = hovered
    ? `stroke: ${hoverColor()}`
    : `stroke: ${color}`

  function hoverColor() {
    const firstChar = color.charAt(1)
    const isDark = !isNaN(firstChar) && parseInt(firstChar, 16) < 8
    console.log("First char of color:", color, firstChar, isDark)  
    return isDark ? "#000" : "#fff"
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<svg
  on:mouseenter={() => hovered = true}
  on:mouseleave={() => hovered = false}
  style={dynamicStyle}
  viewBox="0 0 24 24"
  fill="none"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  stroke={color}
>
  <!-- Bin Lid -->
  <path d="M3 6h18" />
  <path
    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
  />

  <!-- Vertical Lines (Detail) -->
  <line x1="10" y1="11" x2="10" y2="17" />
  <line x1="14" y1="11" x2="14" y2="17" />
</svg>

<style>
  svg {
    width: 1.5em;
    height: 1.5em;
  }
</style>

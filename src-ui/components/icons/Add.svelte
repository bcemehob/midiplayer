<script>
  // @ts-nocheck
  export let color
  let hovered = false

  $: dynamicStyle = hovered ? `stroke: ${hoverColor()}` : `stroke: ${color}`

  function hoverColor() {
    const firstChar = color.charAt(1)
    const isDark = !isNaN(firstChar) && parseInt(firstChar, 16) < 8
    return isDark ? "#000" : "#fff"
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<svg
  on:mouseenter={() => (hovered = true)}
  on:mouseleave={() => (hovered = false)}
  style={dynamicStyle}
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke={color}
>
  <circle cx="12" cy="12" r="10" stroke-width="2" fill="none" />
  <line
    x1="12"
    y1="7"
    x2="12"
    y2="17"
    stroke-width="2"
    stroke-linecap="round"
  />
  <line
    x1="7"
    y1="12"
    x2="17"
    y2="12"
    stroke-width="2"
    stroke-linecap="round"
  />
</svg>

<style>
  svg {
    width: 1.5em;
    height: 1.5em;
  }
</style>

<script>
  // @ts-nocheck
  export let onDrop
  export let onClick

  let isDragOver = false

  function handleDrop(event) {
    event.preventDefault()
    const droppedFile = Array.from(event.dataTransfer.files)?.[0]
    onDrop(droppedFile)
    isDragOver = false
  }

  function handleDragOver(event) {
    event.preventDefault()
    isDragOver = true
  }

  function handleDragLeave(event) {
    event.preventDefault()
    isDragOver = false
  }

  function handleClick(event) {
    event.preventDefault()
    isDragOver = false
    onClick()
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="dropzone{isDragOver ? ' dragover' : ''}"
  on:dragover={handleDragOver}
  on:dragleave={handleDragLeave}
  on:drop={handleDrop}
  on:click={handleClick}
>
  Click of drop
</div>

<style>
  .dropzone {
    border: 2px dashed #bbb2a3;
    border-radius: 8px;
    padding: 0.5em;
    text-align: center;
    color: #7b7253;
    margin: 0.5em;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  .dropzone.dragover, .dropzone:hover {
    background: #bfbfa5;
    color: #5b5243;
  }
</style>

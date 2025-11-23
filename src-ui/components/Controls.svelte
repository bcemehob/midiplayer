<script>
  // @ts-nocheck

  export let fileName = null
  export let folderName = null
  export let audioUrl = null
  let audioEl = null

  async function start() {
    if (!fileName) {
      alert("Upload a file first!")
      return
    }
    await fetch(`/api/start/${encodeURIComponent(folderName)}/${encodeURIComponent(fileName)}`)
    audioEl.play()
  }

  async function stop() {
    await fetch("/api/stop")
    audioEl.pause()
  }
</script>

<div>
  <div>File name: {fileName}</div>
  <button class="sym" on:click={start} disabled="{!fileName}">▶</button>
  <button class="sym" on:click={stop} disabled="{!fileName}">⏹</button>
</div>
<div>
  <audio bind:this={audioEl} src={audioUrl}></audio>
</div>

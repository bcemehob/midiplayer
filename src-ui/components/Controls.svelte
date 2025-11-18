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

  async function analyze() {
    await fetch(`/api/analyze/${encodeURIComponent(folderName)}/${encodeURIComponent(fileName)}`)
    audioEl.pause()
  }
</script>

<div>
  <button on:click={start}>Start</button>
  <button on:click={stop}>Stop</button>
  <button on:click={analyze}>Analyze</button>
</div>
<div>
  <audio bind:this={audioEl} src={audioUrl} controls></audio>
</div>

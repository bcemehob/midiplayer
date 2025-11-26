<script>
  // @ts-nocheck
  import { isPlaybackStopped, midiEvent } from "../store/sse"
  export let fileName = null
  export let folderName = null
  export let audioUrl = null
  let audioEl = null

  async function start() {
    if (!fileName) {
      alert("Upload a file first!")
      return
    }
    await fetch(
      `/api/start/${encodeURIComponent(folderName)}/${encodeURIComponent(fileName)}`,
    )
    isPlaybackStopped.set(false)
    audioEl.play()
  }

  async function stop() {
    await fetch("/api/stop")
    isPlaybackStopped.set(true)
    audioEl.pause()
  }

  async function pause() {
    await fetch("/api/pause")
    isPlaybackStopped.set(true)
    audioEl.pause()
  }
</script>

<div>
  <div>File name: {fileName}</div>

  {#if $isPlaybackStopped}
    <button class="sym" on:click={start} disabled={!fileName}>▶</button>
  {:else}
    <button class="sym" on:click={pause} disabled={!fileName}>⏸</button>
  {/if}
  <button class="sym" on:click={stop} disabled={!fileName || $isPlaybackStopped}>⏹</button>
</div>
<div>
  <audio bind:this={audioEl} src={audioUrl}></audio>
</div>

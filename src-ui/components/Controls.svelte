<script>
  // @ts-nocheck
  import { isPlaybackStopped, midiEvent, currentTimeMs } from "../store/sse"
  export let fileName = null
    export let audioUrl = null
  let audioEl = null

  $: if (audioEl) {
    audioEl.currentTime = $currentTimeMs / 1000
  }

  async function start() {
    await fetch("/api/start")
    isPlaybackStopped.set(false)
    audioEl.play()
  }

  async function stop() {
    await fetch("/api/stop")
    isPlaybackStopped.set(true)
    audioEl.pause()
    audioEl.currentTime = 0
    midiEvent.set({tick: 0})
    currentTimeMs.set(0)
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

<script>
  // @ts-nocheck
  import { goToTick } from "../helpers/playback"
  import {
    isPlaybackStopped,
    midiEvent,
    currentTimeMs,
    latestStartTick,
  } from "../store"
  export let fileName = null
  export let audioUrl = null
  let audioEl = null

  $: if (audioEl) {
    audioEl.currentTime = $currentTimeMs / 1000
  }

  async function start() {
    await fetch("/api/start")
    isPlaybackStopped.set(false)
    audioEl.currentTime = $currentTimeMs
    audioEl.play()
  }

  async function stop() {
    await fetch("/api/stop")
    stopPlaybackAndSetCursor()
  }

  async function pause() {
    await fetch("/api/pause")
    latestStartTick.set($midiEvent.tick)
    stopPlaybackAndSetCursor()

  }

  function handleEnded() {
    stopPlaybackAndSetCursor()
  }

  function rewindToStart() {
    goToTick(0)
    stopPlaybackAndSetCursor()
  }

  function stopPlaybackAndSetCursor() {
    isPlaybackStopped.set(true)
    audioEl.pause()
    goToTick($latestStartTick)
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
  <button class="sym" on:click={() => goToTick(0)} disabled={!fileName}>⏮</button>
</div>
<div>
  <audio bind:this={audioEl} src={audioUrl} on:ended={handleEnded}></audio>
</div>

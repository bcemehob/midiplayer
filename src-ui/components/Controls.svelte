<script>
  // @ts-nocheck
  import { goToTick } from "../helpers/playback"
  import {
    isPlaybackStopped,
    midiEvent,
    currentTimeMs,
    latestStartFrom,
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
    audioEl.play()
  }

  async function stop() {
    await fetch("/api/stop")
    isPlaybackStopped.set(true)
    stopPlaybackAndSetCursor()
  }

  async function pause() {
    await fetch("/api/pause")
    isPlaybackStopped.set(true)
    audioEl.pause()
  }

  function handleEnded() {
    isPlaybackStopped.set(true)
    stopPlaybackAndSetCursor()
  }

  function rewindToStart() {
    goToTick(0)
    stopPlaybackAndSetCursor()
  }

  function stopPlaybackAndSetCursor() {
    audioEl.pause()
    midiEvent.set({ tick: $latestStartFrom.tick })
    currentTimeMs.set($latestStartFrom.ms)
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

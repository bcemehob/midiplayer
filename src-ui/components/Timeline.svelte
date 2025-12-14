<script>
  // @ts-nocheck
  import { onMount, onDestroy } from "svelte"
  import { goToTick } from "../helpers/playback"
  import { offset } from "../helpers/timeline"
  import {
    currentTimeMs,
    midiEvent,
    midiEvents,
    latestStartTick,
    totalTicks,
  } from "../store"
  import Track from "./Track.svelte"
  export let analyzis = null
  const data = {
    timeline: [],
    ppqn: 0,
    quarterNotes: [],
    totalTicks: 0,
    measures: 0,
    tempos: [],
    timeSignatures: [],
    tracks: [],
  }

  window.addEventListener("beforeunload", async (event) => {
    await fetch("/api/stop")
    midiEvent.set({ tick: 0 })
  })
  onDestroy(() => window.removeEventListener("beforeunload", handler))

  $: if (analyzis) {
    prepareTimeline(analyzis)
  }

  function getMeasureStarts() {
    let measureStarts = []
    for (let i = 0; i < data.timeSignatures.length; i++) {
      const ts = data.timeSignatures[i]
      const numerator = ts.timeSignature[0]
      const denominator = ts.timeSignature[1]
      const measureTicks = numerator * ((data.ppqn * 4) / denominator)

      let startTick = ts.ticks
      let endTick =
        i + 1 < data.timeSignatures.length
          ? data.timeSignatures[i + 1].ticks
          : data.totalTicks

      while (startTick < endTick) {
        measureStarts.push(startTick)
        startTick += measureTicks
      }
    }
    return measureStarts
  }

  function prepareTimeline(analyzis) {
    data.ppqn = analyzis.ppqn
    data.totalTicks = analyzis.totalTicks
    data.tempos = analyzis.tempos
    data.timeSignatures = analyzis.timeSignatures
    data.tracks = analyzis.tracks
    totalTicks.set(analyzis.totalTicks)
    getQuarterNotes(getMeasureStarts())
  }

  function getQuarterNotes(measureStarts) {
    data.quarterNotes = Array.from(
      { length: Math.ceil(data.totalTicks / data.ppqn) },
      (_, i) => {
        const tick = i * data.ppqn
        return { tick, isMeasureStart: measureStarts.includes(tick) }
      },
    )
  }

</script>

<div class="card timeline-card">
  <h3>Track Timeline</h3>
  <div class="timeline-wrap">
    <div class="timeline">
      <div class="scala">
        {#each data.tempos as tempo}
          <div class="tempo" style={offset(tempo.ticks, data.totalTicks)}>
            bpm: {tempo.bpm.toFixed(1)}
          </div>
        {/each}

        {#each data.timeSignatures as timeSignature}
          <div class="signature" style={offset(timeSignature.ticks, data.totalTicks)}>
            {`${timeSignature.timeSignature[0]}/${timeSignature.timeSignature[1]}`}
          </div>
        {/each}

        {#each data.quarterNotes as quarterNote}
          <div
            role="button"
            class={`note${quarterNote.isMeasureStart ? " measure" : ""}`}
            tabindex="0"
            on:click={() => goToTick(quarterNote.tick)}
            on:keydown={(e) => e.key === "Enter" && goToTick(quarterNote.tick)}
            style={offset(quarterNote.tick, data.totalTicks)}
          >
          </div>
        {/each}
      </div>
      <div class="tracks">
        {#each data.tracks as track, index}
          <Track {track} {index} totalTicks={data.totalTicks}/>
        {/each}
      </div>
      <div class="cursor" style={offset($midiEvent.tick, data.totalTicks)}></div>
    </div>
  </div>
</div>

<style>
  .timeline-wrap {
    position: relative;
    margin: 0 1em;
  }
  .timeline-card {
    position: relative;
    padding: 1em 0;
  }
  .timeline {
    margin-top: 60px;
    margin-bottom: 60px;
    position: relative;
    min-height: 50px;
  }
  .timeline::before {
    content: "";
    position: absolute;
    top: 9%;
    left: 0;
    width: 100%;
    height: 1px;
    background: #ccc;
    transform: translateY(-50%);
  }
  .cursor {
    position: absolute;
    top: 0;
    height: 100%;
    width: 2px;
    border-left: 2px dashed green;
    color: black;
    cursor: pointer;
  }
  .note {
    position: absolute;
    top: 35%;
    height: 30%;
    width: 100%;
    border-left: 1px solid #7974c0;
    color: black;
    cursor: pointer;
  }
  .note.measure {
    top: 30%;
    height: 40%;
    border-left: 2px solid #0b0924;
  }
  .tempo {
    position: absolute;
    top: 0;
    color: rgb(142, 35, 35);
    font-size: 10pt;
    max-width: 15px;
    top: 20pt;
  }
  .signature {
    position: absolute;
    top: -20pt;
    font-size: 10pt;
    color: rgb(65, 100, 124);
  }
  .scala {
    position: relative;
    height: 55px;
  }
  .tracks {
    position: relative;
    margin-top: 40px;
  }
</style>

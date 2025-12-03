<script>
  // @ts-nocheck
  import { onMount, onDestroy } from "svelte"
  import { currentTimeMs, midiEvent, midiEvents } from "../store/sse"
  export let analyzis = null
  const data = {
    timeline: [],
    ppqn: 0,
    quarterNotes: [],
    totalTicks: 0,
    measures: 0,
    tempos: [],
    timeSignatures: [],
  }

  window.addEventListener("beforeunload", async event => {
    await fetch("/api/stop")
    midiEvent.set({tick: 0})
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

  async function goToTick(tick) {
    midiEvent.set({tick})
    const res = await fetch(`/api/jump?tick=${tick}`)
    const data = await res.json()
    if (!!data.currentTimeMs && !Number.isNaN(data.currentTimeMs)) {
      currentTimeMs.set(Number(data.currentTimeMs))
    }
  }

  function offset(tick) {
    const offset = (tick / data.totalTicks) * 100
    return `left:${offset}%`
  }

  function noteStyle(quarterNote) {
    let style = offset(quarterNote.tick)
    if (quarterNote.isMeasureStart) {
      style += ";font-weight:bold;font-size:16pt;color:#661c6f"
    }
    return style
  }

</script>

<div class="card timeline-card">
  <h3>Track Timeline</h3>
  <div class="timeline">
    <div class="cursor" style={offset($midiEvent.tick)}></div>
    {#each data.tempos as tempo}
      <div class="tempo" style={offset(tempo.ticks)}>
        bpm: {tempo.bpm.toFixed(1)}
      </div>
    {/each}

    {#each data.timeSignatures as timeSignature}
      <div class="signature" style={offset(timeSignature.ticks)}>
        {`${timeSignature.timeSignature[0]}/${timeSignature.timeSignature[1]}`}
      </div>
    {/each}

    {#each data.quarterNotes as quarterNote}
      <div
        class="note"
        on:click={() => goToTick(quarterNote.tick)}
        style={noteStyle(quarterNote)}
      >
        |
      </div>
    {/each}
  </div>
</div>

<style>
  .timeline {
    margin-top: 60px;
    margin-bottom: 60px;
    position: relative;
    min-height: 50px;
  }
  .timeline::before {
    content: "";
    position: absolute;
    top: 25%;
    left: 0;
    width: 100%;
    height: 1px;
    background: #ccc;
    transform: translateY(-50%);
  }
  .cursor {
    position: absolute;
    top: 0;
    left: 0;
    height: 100px;
    width: 20px;
    border-left: 2px dashed green;
    color: black;
    cursor: pointer;
  }
  .note {
    position: absolute;
    top: 0;
    height: 100%;
    color: black;
    cursor: pointer;
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
</style>

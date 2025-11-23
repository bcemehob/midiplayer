<script>
  // @ts-nocheck
  import { onMount } from "svelte"
  import { midiEvent, midiEvents } from "../store/sse"
  export let analyzis = null
  const data = {
    timeline: [],
    ppqn: 0,
    quarterNotes: [],
    measureStarts: [],
    totalTicks: 0,
    measures: 0,
    tempos: [],
    timeSignatures: [],
  }

  $: if (analyzis) {
    prepareTimeline(analyzis)
    console.log("data", data)
  }

  function prepareTimeline(analyzis) {
    data.ppqn = analyzis.ppqn
    data.totalTicks = analyzis.totalTicks
    data.quarterNotes = Math.ceil(data.totalTicks / data.ppqn)
    data.tempos = analyzis.tempos
    data.timeSignatures = analyzis.timeSignatures
    data.quarterNotes = quarterNotes()
    data.measureStarts = measureStarts()
  }

  function quarterNotes() {
    return Array.from(
      { length: Math.ceil(data.totalTicks / data.ppqn) },
      (_, i) => i * data.ppqn,
    )
  }

  function measureStarts() {
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
  function goToTick(tick) {
    console.log(tick)
    return null
  }
  function offset(tick) {
    const offset = (tick / data.totalTicks) * 100
    return `left:${offset}%`
  }
  function noteStyle(tick) {
    let style = offset(tick)
    if (tick === 0 || data.measureStarts.find((ms) => ms === tick)) {
      style += ";font-weight:bold;font-size:16pt;color:#661c6f"
    }
    return style
  }
</script>

<div class="card timeline-card">
  <h3>Track Timeline:</h3>
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

    {#each data.quarterNotes as tick}
      <div class="note" on:click={() => goToTick(tick)} style={noteStyle(tick)}>
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
